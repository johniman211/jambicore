-- Jambi Core - Protection Case Security
-- Extra restrictions for sensitive GBV/Child Protection cases

-- ============================================
-- PROTECTION CASES RLS (SENSITIVE DATA)
-- ============================================

-- Drop existing case policies and create stricter ones
DROP POLICY IF EXISTS "cases_select" ON cases;
DROP POLICY IF EXISTS "cases_insert" ON cases;
DROP POLICY IF EXISTS "cases_update" ON cases;
DROP POLICY IF EXISTS "cases_delete" ON cases;

-- Cases: Non-sensitive visible to all org members, sensitive only to authorized roles or break-glass
CREATE POLICY "cases_select_general" ON cases FOR SELECT USING (
  is_member_of_org(org_id) AND NOT is_sensitive
);

CREATE POLICY "cases_select_sensitive" ON cases FOR SELECT USING (
  is_sensitive AND (
    can_access_protection(org_id) OR
    has_break_glass_access(id)
  )
);

-- Only authorized roles can create sensitive cases
CREATE POLICY "cases_insert" ON cases FOR INSERT WITH CHECK (
  is_member_of_org(org_id) AND (
    NOT (case_type IN ('gbv', 'child_protection', 'other_protection')) OR
    can_access_protection(org_id)
  )
);

-- Only authorized roles can update sensitive cases
CREATE POLICY "cases_update_general" ON cases FOR UPDATE USING (
  is_member_of_org(org_id) AND NOT is_sensitive AND
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'program_manager', 'field_officer']::user_role[])
);

CREATE POLICY "cases_update_sensitive" ON cases FOR UPDATE USING (
  is_sensitive AND can_access_protection(org_id)
);

-- Only org admins can delete cases
CREATE POLICY "cases_delete" ON cases FOR DELETE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
);

-- ============================================
-- CASE NOTES RLS
-- ============================================

DROP POLICY IF EXISTS "case_notes_select" ON case_notes;
DROP POLICY IF EXISTS "case_notes_insert" ON case_notes;

-- Case notes: check parent case sensitivity
CREATE POLICY "case_notes_select" ON case_notes FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM cases c WHERE c.id = case_notes.case_id AND (
      (is_member_of_org(c.org_id) AND NOT c.is_sensitive) OR
      (c.is_sensitive AND (can_access_protection(c.org_id) OR has_break_glass_access(c.id)))
    )
  )
);

CREATE POLICY "case_notes_insert" ON case_notes FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM cases c WHERE c.id = case_notes.case_id AND (
      (is_member_of_org(c.org_id) AND NOT c.is_sensitive) OR
      (c.is_sensitive AND can_access_protection(c.org_id))
    )
  )
);

-- ============================================
-- CASE REFERRALS RLS
-- ============================================

DROP POLICY IF EXISTS "case_referrals_select" ON case_referrals;
DROP POLICY IF EXISTS "case_referrals_insert" ON case_referrals;

CREATE POLICY "case_referrals_select" ON case_referrals FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM cases c WHERE c.id = case_referrals.case_id AND (
      (is_member_of_org(c.org_id) AND NOT c.is_sensitive) OR
      (c.is_sensitive AND (can_access_protection(c.org_id) OR has_break_glass_access(c.id)))
    )
  )
);

CREATE POLICY "case_referrals_insert" ON case_referrals FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM cases c WHERE c.id = case_referrals.case_id AND (
      (is_member_of_org(c.org_id) AND NOT c.is_sensitive) OR
      (c.is_sensitive AND can_access_protection(c.org_id))
    )
  )
);

CREATE POLICY "case_referrals_update" ON case_referrals FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM cases c WHERE c.id = case_referrals.case_id AND (
      (is_member_of_org(c.org_id) AND NOT c.is_sensitive) OR
      (c.is_sensitive AND can_access_protection(c.org_id))
    )
  )
);

-- ============================================
-- ACCESS LOGGING FUNCTIONS
-- ============================================

-- Function to log access to sensitive cases
CREATE OR REPLACE FUNCTION log_case_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log access to sensitive cases
  IF NEW.is_sensitive THEN
    INSERT INTO access_logs (org_id, user_id, case_id, access_type, break_glass_grant_id)
    SELECT 
      NEW.org_id,
      auth.uid(),
      NEW.id,
      'view',
      (
        SELECT id FROM access_grants 
        WHERE case_id = NEW.id 
          AND user_id = auth.uid() 
          AND expires_at > NOW() 
          AND revoked_at IS NULL
        LIMIT 1
      );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to log case access (for sensitive cases via select statements)
-- Note: This is for demonstration; actual logging should happen in application code

-- ============================================
-- BREAK GLASS WORKFLOW
-- ============================================

-- Function to grant break glass access
CREATE OR REPLACE FUNCTION grant_break_glass_access(
  p_request_id UUID,
  p_expires_hours INTEGER DEFAULT 24
)
RETURNS UUID AS $$
DECLARE
  v_request break_glass_requests;
  v_grant_id UUID;
BEGIN
  -- Get the request
  SELECT * INTO v_request FROM break_glass_requests WHERE id = p_request_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Break glass request not found';
  END IF;
  
  IF v_request.status != 'pending' THEN
    RAISE EXCEPTION 'Request is not pending';
  END IF;
  
  -- Check if approver has permission
  IF NOT can_access_protection(v_request.org_id) THEN
    RAISE EXCEPTION 'You do not have permission to approve break glass requests';
  END IF;
  
  -- Create the access grant
  INSERT INTO access_grants (
    org_id,
    break_glass_request_id,
    user_id,
    case_id,
    granted_by,
    expires_at
  ) VALUES (
    v_request.org_id,
    p_request_id,
    v_request.requested_by,
    v_request.case_id,
    auth.uid(),
    NOW() + (p_expires_hours || ' hours')::INTERVAL
  ) RETURNING id INTO v_grant_id;
  
  -- Update the request status
  UPDATE break_glass_requests
  SET status = 'approved',
      reviewed_by = auth.uid(),
      reviewed_at = NOW()
  WHERE id = p_request_id;
  
  -- Log the approval
  INSERT INTO audit_logs (org_id, user_id, action, entity_type, entity_id, new_values)
  VALUES (
    v_request.org_id,
    auth.uid(),
    'break_glass_approved',
    'break_glass_request',
    p_request_id,
    jsonb_build_object(
      'grant_id', v_grant_id,
      'case_id', v_request.case_id,
      'granted_to', v_request.requested_by,
      'expires_at', NOW() + (p_expires_hours || ' hours')::INTERVAL
    )
  );
  
  RETURN v_grant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reject break glass request
CREATE OR REPLACE FUNCTION reject_break_glass_access(
  p_request_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_request break_glass_requests;
BEGIN
  -- Get the request
  SELECT * INTO v_request FROM break_glass_requests WHERE id = p_request_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Break glass request not found';
  END IF;
  
  IF v_request.status != 'pending' THEN
    RAISE EXCEPTION 'Request is not pending';
  END IF;
  
  -- Check if rejecter has permission
  IF NOT can_access_protection(v_request.org_id) THEN
    RAISE EXCEPTION 'You do not have permission to reject break glass requests';
  END IF;
  
  -- Update the request status
  UPDATE break_glass_requests
  SET status = 'rejected',
      reviewed_by = auth.uid(),
      reviewed_at = NOW(),
      review_notes = p_reason
  WHERE id = p_request_id;
  
  -- Log the rejection
  INSERT INTO audit_logs (org_id, user_id, action, entity_type, entity_id, new_values)
  VALUES (
    v_request.org_id,
    auth.uid(),
    'break_glass_rejected',
    'break_glass_request',
    p_request_id,
    jsonb_build_object(
      'case_id', v_request.case_id,
      'requested_by', v_request.requested_by,
      'reason', p_reason
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to revoke break glass access
CREATE OR REPLACE FUNCTION revoke_break_glass_access(
  p_grant_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_grant access_grants;
BEGIN
  -- Get the grant
  SELECT * INTO v_grant FROM access_grants WHERE id = p_grant_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Access grant not found';
  END IF;
  
  IF v_grant.revoked_at IS NOT NULL THEN
    RAISE EXCEPTION 'Access already revoked';
  END IF;
  
  -- Check if revoker has permission
  IF NOT can_access_protection(v_grant.org_id) THEN
    RAISE EXCEPTION 'You do not have permission to revoke access grants';
  END IF;
  
  -- Revoke the grant
  UPDATE access_grants
  SET revoked_at = NOW(),
      revoked_by = auth.uid(),
      revoke_reason = p_reason
  WHERE id = p_grant_id;
  
  -- Log the revocation
  INSERT INTO audit_logs (org_id, user_id, action, entity_type, entity_id, new_values)
  VALUES (
    v_grant.org_id,
    auth.uid(),
    'access_grant_revoked',
    'access_grant',
    p_grant_id,
    jsonb_build_object(
      'case_id', v_grant.case_id,
      'user_id', v_grant.user_id,
      'reason', p_reason
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SCHEDULED: EXPIRE BREAK GLASS GRANTS
-- ============================================

-- Function to expire old grants (call via cron)
CREATE OR REPLACE FUNCTION expire_break_glass_grants()
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Update expired requests
  UPDATE break_glass_requests
  SET status = 'expired'
  WHERE status = 'pending' 
    AND requested_at < NOW() - INTERVAL '48 hours';
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- REDACTED CASE VIEW
-- ============================================

-- View for redacted case information (unauthorized users)
CREATE OR REPLACE VIEW cases_redacted AS
SELECT 
  id,
  org_id,
  branch_id,
  office_id,
  case_number,
  case_type,
  is_sensitive,
  status,
  priority,
  CASE 
    WHEN is_sensitive THEN '[REDACTED - Sensitive Case]'
    ELSE title
  END as title,
  CASE 
    WHEN is_sensitive THEN NULL
    ELSE description
  END as description,
  intake_date,
  CASE 
    WHEN is_sensitive THEN NULL
    ELSE assigned_to
  END as assigned_to,
  created_at,
  updated_at,
  closed_at
FROM cases;

-- Grant access to authenticated users
GRANT SELECT ON cases_redacted TO authenticated;
