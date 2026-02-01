-- Jambi Core - Row Level Security Policies
-- Tenant isolation and role-based access control

-- Enable RLS on all tables
ALTER TABLE orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicator_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaries_individual ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaries_household ENABLE ROW LEVEL SECURITY;
ALTER TABLE household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE distribution_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE distribution_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_request_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE break_glass_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get user's org memberships
CREATE OR REPLACE FUNCTION get_user_org_ids()
RETURNS SETOF UUID AS $$
  SELECT org_id FROM memberships 
  WHERE user_id = auth.uid() AND is_active = true;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if user is in org
CREATE OR REPLACE FUNCTION is_member_of_org(org_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM memberships 
    WHERE user_id = auth.uid() 
      AND memberships.org_id = is_member_of_org.org_id 
      AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Get user's role in org
CREATE OR REPLACE FUNCTION get_user_role(org_id UUID)
RETURNS user_role AS $$
  SELECT role FROM memberships 
  WHERE user_id = auth.uid() 
    AND memberships.org_id = get_user_role.org_id 
    AND is_active = true;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM memberships 
    WHERE user_id = auth.uid() 
      AND role = 'super_admin' 
      AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if user has role in org
CREATE OR REPLACE FUNCTION has_role_in_org(org_id UUID, required_roles user_role[])
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM memberships 
    WHERE user_id = auth.uid() 
      AND memberships.org_id = has_role_in_org.org_id 
      AND role = ANY(required_roles)
      AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if user can access protection cases
CREATE OR REPLACE FUNCTION can_access_protection(org_id UUID)
RETURNS BOOLEAN AS $$
  SELECT has_role_in_org(
    org_id, 
    ARRAY['super_admin', 'org_admin', 'protection_officer', 'auditor']::user_role[]
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if user has break glass access to a case
CREATE OR REPLACE FUNCTION has_break_glass_access(case_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM access_grants 
    WHERE access_grants.case_id = has_break_glass_access.case_id
      AND user_id = auth.uid()
      AND expires_at > NOW()
      AND revoked_at IS NULL
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- ORGANIZATIONS
-- ============================================

-- Super admins see all orgs, users see their orgs
CREATE POLICY "orgs_select" ON orgs FOR SELECT USING (
  is_super_admin() OR id IN (SELECT get_user_org_ids())
);

-- Only super admins can create orgs
CREATE POLICY "orgs_insert" ON orgs FOR INSERT WITH CHECK (is_super_admin());

-- Org admins can update their org
CREATE POLICY "orgs_update" ON orgs FOR UPDATE USING (
  is_super_admin() OR has_role_in_org(id, ARRAY['org_admin']::user_role[])
);

-- Only super admins can delete orgs
CREATE POLICY "orgs_delete" ON orgs FOR DELETE USING (is_super_admin());

-- ============================================
-- BRANCHES & OFFICES
-- ============================================

CREATE POLICY "branches_select" ON branches FOR SELECT USING (is_member_of_org(org_id));
CREATE POLICY "branches_insert" ON branches FOR INSERT WITH CHECK (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
);
CREATE POLICY "branches_update" ON branches FOR UPDATE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
);
CREATE POLICY "branches_delete" ON branches FOR DELETE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
);

CREATE POLICY "offices_select" ON offices FOR SELECT USING (is_member_of_org(org_id));
CREATE POLICY "offices_insert" ON offices FOR INSERT WITH CHECK (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
);
CREATE POLICY "offices_update" ON offices FOR UPDATE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
);
CREATE POLICY "offices_delete" ON offices FOR DELETE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
);

-- ============================================
-- PROFILES & MEMBERSHIPS
-- ============================================

-- Users can see their own profile and profiles of org members
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (
  id = auth.uid() OR 
  id IN (
    SELECT m2.user_id FROM memberships m1
    JOIN memberships m2 ON m1.org_id = m2.org_id
    WHERE m1.user_id = auth.uid() AND m1.is_active = true
  )
);

-- Users can update their own profile
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (id = auth.uid());

-- Memberships: visible to org members
CREATE POLICY "memberships_select" ON memberships FOR SELECT USING (
  user_id = auth.uid() OR is_member_of_org(org_id)
);

-- Only org admins can manage memberships
CREATE POLICY "memberships_insert" ON memberships FOR INSERT WITH CHECK (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
);
CREATE POLICY "memberships_update" ON memberships FOR UPDATE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
);
CREATE POLICY "memberships_delete" ON memberships FOR DELETE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
);

-- ============================================
-- PROJECTS & ACTIVITIES
-- ============================================

CREATE POLICY "projects_select" ON projects FOR SELECT USING (is_member_of_org(org_id));
CREATE POLICY "projects_insert" ON projects FOR INSERT WITH CHECK (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'program_manager']::user_role[])
);
CREATE POLICY "projects_update" ON projects FOR UPDATE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'program_manager']::user_role[])
);
CREATE POLICY "projects_delete" ON projects FOR DELETE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
);

CREATE POLICY "activities_select" ON activities FOR SELECT USING (is_member_of_org(org_id));
CREATE POLICY "activities_insert" ON activities FOR INSERT WITH CHECK (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'program_manager']::user_role[])
);
CREATE POLICY "activities_update" ON activities FOR UPDATE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'program_manager']::user_role[])
);
CREATE POLICY "activities_delete" ON activities FOR DELETE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
);

-- Indicators
CREATE POLICY "indicators_select" ON indicators FOR SELECT USING (is_member_of_org(org_id));
CREATE POLICY "indicators_insert" ON indicators FOR INSERT WITH CHECK (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'program_manager', 'me_officer']::user_role[])
);
CREATE POLICY "indicators_update" ON indicators FOR UPDATE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'program_manager', 'me_officer']::user_role[])
);
CREATE POLICY "indicators_delete" ON indicators FOR DELETE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
);

CREATE POLICY "indicator_measurements_select" ON indicator_measurements FOR SELECT USING (is_member_of_org(org_id));
CREATE POLICY "indicator_measurements_insert" ON indicator_measurements FOR INSERT WITH CHECK (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'program_manager', 'me_officer']::user_role[])
);

-- ============================================
-- BENEFICIARIES
-- ============================================

CREATE POLICY "beneficiaries_individual_select" ON beneficiaries_individual FOR SELECT USING (is_member_of_org(org_id));
CREATE POLICY "beneficiaries_individual_insert" ON beneficiaries_individual FOR INSERT WITH CHECK (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'program_manager', 'field_officer', 'data_entry']::user_role[])
);
CREATE POLICY "beneficiaries_individual_update" ON beneficiaries_individual FOR UPDATE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'program_manager', 'field_officer', 'data_entry']::user_role[])
);
CREATE POLICY "beneficiaries_individual_delete" ON beneficiaries_individual FOR DELETE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
);

CREATE POLICY "beneficiaries_household_select" ON beneficiaries_household FOR SELECT USING (is_member_of_org(org_id));
CREATE POLICY "beneficiaries_household_insert" ON beneficiaries_household FOR INSERT WITH CHECK (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'program_manager', 'field_officer', 'data_entry']::user_role[])
);
CREATE POLICY "beneficiaries_household_update" ON beneficiaries_household FOR UPDATE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'program_manager', 'field_officer', 'data_entry']::user_role[])
);
CREATE POLICY "beneficiaries_household_delete" ON beneficiaries_household FOR DELETE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
);

CREATE POLICY "household_members_select" ON household_members FOR SELECT USING (is_member_of_org(org_id));
CREATE POLICY "household_members_insert" ON household_members FOR INSERT WITH CHECK (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'program_manager', 'field_officer', 'data_entry']::user_role[])
);
CREATE POLICY "household_members_delete" ON household_members FOR DELETE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
);

CREATE POLICY "enrollments_select" ON enrollments FOR SELECT USING (is_member_of_org(org_id));
CREATE POLICY "enrollments_insert" ON enrollments FOR INSERT WITH CHECK (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'program_manager', 'field_officer', 'data_entry']::user_role[])
);
CREATE POLICY "enrollments_update" ON enrollments FOR UPDATE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'program_manager']::user_role[])
);

-- ============================================
-- DISTRIBUTIONS
-- ============================================

CREATE POLICY "distributions_select" ON distributions FOR SELECT USING (is_member_of_org(org_id));
CREATE POLICY "distributions_insert" ON distributions FOR INSERT WITH CHECK (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'program_manager', 'field_officer', 'data_entry']::user_role[])
);
CREATE POLICY "distributions_update" ON distributions FOR UPDATE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'program_manager', 'field_officer', 'data_entry']::user_role[])
);
CREATE POLICY "distributions_delete" ON distributions FOR DELETE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
);

CREATE POLICY "distribution_items_select" ON distribution_items FOR SELECT USING (is_member_of_org(org_id));
CREATE POLICY "distribution_items_insert" ON distribution_items FOR INSERT WITH CHECK (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'program_manager', 'field_officer', 'data_entry']::user_role[])
);
CREATE POLICY "distribution_items_update" ON distribution_items FOR UPDATE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'program_manager', 'field_officer']::user_role[])
);
CREATE POLICY "distribution_items_delete" ON distribution_items FOR DELETE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
);

CREATE POLICY "distribution_recipients_select" ON distribution_recipients FOR SELECT USING (is_member_of_org(org_id));
CREATE POLICY "distribution_recipients_insert" ON distribution_recipients FOR INSERT WITH CHECK (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'program_manager', 'field_officer', 'data_entry']::user_role[])
);
CREATE POLICY "distribution_recipients_update" ON distribution_recipients FOR UPDATE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'program_manager', 'field_officer', 'data_entry']::user_role[])
);

-- ============================================
-- FINANCE
-- ============================================

CREATE POLICY "budgets_select" ON budgets FOR SELECT USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'program_manager', 'finance', 'auditor']::user_role[])
);
CREATE POLICY "budgets_insert" ON budgets FOR INSERT WITH CHECK (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'finance']::user_role[])
);
CREATE POLICY "budgets_update" ON budgets FOR UPDATE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'finance']::user_role[])
);
CREATE POLICY "budgets_delete" ON budgets FOR DELETE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
);

CREATE POLICY "budget_lines_select" ON budget_lines FOR SELECT USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'program_manager', 'finance', 'auditor']::user_role[])
);
CREATE POLICY "budget_lines_insert" ON budget_lines FOR INSERT WITH CHECK (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'finance']::user_role[])
);
CREATE POLICY "budget_lines_update" ON budget_lines FOR UPDATE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'finance']::user_role[])
);

CREATE POLICY "expenses_select" ON expenses FOR SELECT USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'program_manager', 'finance', 'auditor']::user_role[])
  OR submitted_by = auth.uid()
);
CREATE POLICY "expenses_insert" ON expenses FOR INSERT WITH CHECK (is_member_of_org(org_id));
CREATE POLICY "expenses_update" ON expenses FOR UPDATE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'finance']::user_role[])
  OR (submitted_by = auth.uid() AND status = 'draft')
);
CREATE POLICY "expenses_delete" ON expenses FOR DELETE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
  OR (submitted_by = auth.uid() AND status = 'draft')
);

CREATE POLICY "expense_attachments_select" ON expense_attachments FOR SELECT USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'program_manager', 'finance', 'auditor']::user_role[])
  OR uploaded_by = auth.uid()
);
CREATE POLICY "expense_attachments_insert" ON expense_attachments FOR INSERT WITH CHECK (is_member_of_org(org_id));

-- ============================================
-- PROCUREMENT
-- ============================================

CREATE POLICY "procurement_requests_select" ON procurement_requests FOR SELECT USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'procurement', 'finance', 'auditor']::user_role[])
  OR requested_by = auth.uid()
);
CREATE POLICY "procurement_requests_insert" ON procurement_requests FOR INSERT WITH CHECK (is_member_of_org(org_id));
CREATE POLICY "procurement_requests_update" ON procurement_requests FOR UPDATE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'procurement']::user_role[])
  OR (requested_by = auth.uid() AND status = 'draft')
);

CREATE POLICY "procurement_request_items_select" ON procurement_request_items FOR SELECT USING (is_member_of_org(org_id));
CREATE POLICY "procurement_request_items_insert" ON procurement_request_items FOR INSERT WITH CHECK (is_member_of_org(org_id));

CREATE POLICY "purchase_orders_select" ON purchase_orders FOR SELECT USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'procurement', 'finance', 'auditor']::user_role[])
);
CREATE POLICY "purchase_orders_insert" ON purchase_orders FOR INSERT WITH CHECK (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'procurement']::user_role[])
);
CREATE POLICY "purchase_orders_update" ON purchase_orders FOR UPDATE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'procurement']::user_role[])
);

-- ============================================
-- ASSETS & INVENTORY
-- ============================================

CREATE POLICY "assets_select" ON assets FOR SELECT USING (is_member_of_org(org_id));
CREATE POLICY "assets_insert" ON assets FOR INSERT WITH CHECK (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'procurement']::user_role[])
);
CREATE POLICY "assets_update" ON assets FOR UPDATE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'procurement']::user_role[])
);
CREATE POLICY "assets_delete" ON assets FOR DELETE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
);

CREATE POLICY "inventory_items_select" ON inventory_items FOR SELECT USING (is_member_of_org(org_id));
CREATE POLICY "inventory_items_insert" ON inventory_items FOR INSERT WITH CHECK (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'procurement', 'field_officer']::user_role[])
);
CREATE POLICY "inventory_items_update" ON inventory_items FOR UPDATE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'procurement', 'field_officer']::user_role[])
);

CREATE POLICY "inventory_transactions_select" ON inventory_transactions FOR SELECT USING (is_member_of_org(org_id));
CREATE POLICY "inventory_transactions_insert" ON inventory_transactions FOR INSERT WITH CHECK (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'procurement', 'field_officer']::user_role[])
);

-- ============================================
-- DOCUMENTS
-- ============================================

CREATE POLICY "documents_select" ON documents FOR SELECT USING (is_member_of_org(org_id));
CREATE POLICY "documents_insert" ON documents FOR INSERT WITH CHECK (is_member_of_org(org_id));
CREATE POLICY "documents_update" ON documents FOR UPDATE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
  OR uploaded_by = auth.uid()
);
CREATE POLICY "documents_delete" ON documents FOR DELETE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
);

CREATE POLICY "document_versions_select" ON document_versions FOR SELECT USING (is_member_of_org(org_id));
CREATE POLICY "document_versions_insert" ON document_versions FOR INSERT WITH CHECK (is_member_of_org(org_id));

-- ============================================
-- WORKFLOWS
-- ============================================

CREATE POLICY "workflow_templates_select" ON workflow_templates FOR SELECT USING (is_member_of_org(org_id));
CREATE POLICY "workflow_templates_insert" ON workflow_templates FOR INSERT WITH CHECK (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
);
CREATE POLICY "workflow_templates_update" ON workflow_templates FOR UPDATE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
);
CREATE POLICY "workflow_templates_delete" ON workflow_templates FOR DELETE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin']::user_role[])
);

CREATE POLICY "workflow_instances_select" ON workflow_instances FOR SELECT USING (is_member_of_org(org_id));
CREATE POLICY "workflow_instances_insert" ON workflow_instances FOR INSERT WITH CHECK (is_member_of_org(org_id));
CREATE POLICY "workflow_instances_update" ON workflow_instances FOR UPDATE USING (is_member_of_org(org_id));

CREATE POLICY "workflow_actions_select" ON workflow_actions FOR SELECT USING (is_member_of_org(org_id));
CREATE POLICY "workflow_actions_insert" ON workflow_actions FOR INSERT WITH CHECK (is_member_of_org(org_id));

-- ============================================
-- BREAK GLASS & ACCESS GRANTS
-- ============================================

CREATE POLICY "break_glass_requests_select" ON break_glass_requests FOR SELECT USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'protection_officer', 'auditor']::user_role[])
  OR requested_by = auth.uid()
);
CREATE POLICY "break_glass_requests_insert" ON break_glass_requests FOR INSERT WITH CHECK (is_member_of_org(org_id));
CREATE POLICY "break_glass_requests_update" ON break_glass_requests FOR UPDATE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'protection_officer']::user_role[])
);

CREATE POLICY "access_grants_select" ON access_grants FOR SELECT USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'protection_officer', 'auditor']::user_role[])
  OR user_id = auth.uid()
);
CREATE POLICY "access_grants_insert" ON access_grants FOR INSERT WITH CHECK (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'protection_officer']::user_role[])
);
CREATE POLICY "access_grants_update" ON access_grants FOR UPDATE USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'protection_officer']::user_role[])
);

-- ============================================
-- AUDIT LOGS
-- ============================================

-- Audit logs visible to admins and auditors
CREATE POLICY "audit_logs_select" ON audit_logs FOR SELECT USING (
  is_super_admin() OR 
  (org_id IS NOT NULL AND has_role_in_org(org_id, ARRAY['org_admin', 'auditor']::user_role[]))
);
CREATE POLICY "audit_logs_insert" ON audit_logs FOR INSERT WITH CHECK (true);

-- Access logs visible to protection roles and auditors
CREATE POLICY "access_logs_select" ON access_logs FOR SELECT USING (
  has_role_in_org(org_id, ARRAY['super_admin', 'org_admin', 'protection_officer', 'auditor']::user_role[])
);
CREATE POLICY "access_logs_insert" ON access_logs FOR INSERT WITH CHECK (is_member_of_org(org_id));
