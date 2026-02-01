// Type definitions for Jambi Core

// App Mode
export type AppMode = 'saas' | 'self_hosted';

// User Roles
export type UserRole = 
  | 'super_admin'      // Platform-wide access
  | 'org_admin'        // Full org access
  | 'program_manager'  // Project-scoped access
  | 'me_officer'       // M&E access
  | 'finance'          // Finance module access
  | 'hr'               // HR/Staff access
  | 'procurement'      // Procurement access
  | 'field_officer'    // Field office data
  | 'data_entry'       // Create beneficiaries/distributions
  | 'viewer'           // Read-only
  | 'auditor'          // Read-all including audit logs
  | 'protection_officer'; // Protection cases access

// Currency types
export type Currency = 'USD' | 'SSP';

// Organization
export interface Organization {
  id: string;
  slug: string;
  name: string;
  logo_url?: string;
  settings: OrgSettings;
  created_at: string;
  updated_at: string;
}

export interface OrgSettings {
  default_currency: Currency;
  fiscal_year_start_month: number;
  require_2fa: boolean;
  allow_offline: boolean;
}

// Branch & Office
export interface Branch {
  id: string;
  org_id: string;
  name: string;
  code: string;
  address?: string;
  created_at: string;
}

export interface Office {
  id: string;
  org_id: string;
  branch_id: string;
  name: string;
  code: string;
  location?: string;
  is_field_office: boolean;
  created_at: string;
}

// User Profile
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Membership (User -> Org -> Role)
export interface Membership {
  id: string;
  user_id: string;
  org_id: string;
  role: UserRole;
  branch_id?: string;
  office_id?: string;
  is_active: boolean;
  created_at: string;
}

// Project
export interface Project {
  id: string;
  org_id: string;
  branch_id?: string;
  code: string;
  name: string;
  description?: string;
  donor?: string;
  status: 'draft' | 'active' | 'completed' | 'suspended';
  start_date: string;
  end_date?: string;
  budget_usd?: number;
  budget_ssp?: number;
  created_at: string;
  updated_at: string;
}

// Activity
export interface Activity {
  id: string;
  org_id: string;
  project_id: string;
  code: string;
  name: string;
  description?: string;
  status: 'planned' | 'ongoing' | 'completed';
  start_date?: string;
  end_date?: string;
  created_at: string;
}

// Indicator (M&E)
export interface Indicator {
  id: string;
  org_id: string;
  project_id: string;
  activity_id?: string;
  name: string;
  description?: string;
  unit: string;
  target_value: number;
  current_value: number;
  created_at: string;
}

// Beneficiary (Individual)
export interface BeneficiaryIndividual {
  id: string;
  org_id: string;
  branch_id?: string;
  office_id?: string;
  first_name: string;
  last_name: string;
  gender: 'male' | 'female' | 'other';
  date_of_birth?: string;
  phone?: string;
  national_id?: string;
  qr_code?: string;
  household_id?: string;
  is_head_of_household: boolean;
  address?: string;
  vulnerability_status?: string;
  created_at: string;
  updated_at: string;
}

// Beneficiary (Household)
export interface BeneficiaryHousehold {
  id: string;
  org_id: string;
  branch_id?: string;
  office_id?: string;
  household_id: string;
  name: string;
  address?: string;
  member_count: number;
  vulnerability_status?: string;
  qr_code?: string;
  created_at: string;
  updated_at: string;
}

// Enrollment
export interface Enrollment {
  id: string;
  org_id: string;
  project_id: string;
  beneficiary_type: 'individual' | 'household';
  beneficiary_id: string;
  enrolled_at: string;
  enrolled_by: string;
  status: 'active' | 'completed' | 'withdrawn';
}

// Case (including protection cases)
export type CaseType = 'general' | 'gbv' | 'child_protection' | 'other_protection';

export interface Case {
  id: string;
  org_id: string;
  branch_id?: string;
  office_id?: string;
  case_number: string;
  beneficiary_id?: string;
  case_type: CaseType;
  is_sensitive: boolean; // true for GBV/CP cases
  status: 'open' | 'in_progress' | 'referred' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description?: string; // encrypted for sensitive cases
  assigned_to?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
}

export interface CaseNote {
  id: string;
  org_id: string;
  case_id: string;
  content: string; // encrypted for sensitive cases
  created_by: string;
  created_at: string;
}

export interface CaseReferral {
  id: string;
  org_id: string;
  case_id: string;
  referred_to: string;
  referred_by: string;
  reason: string;
  status: 'pending' | 'accepted' | 'completed' | 'rejected';
  created_at: string;
}

// Distribution
export type DistributionType = 'item' | 'cash' | 'voucher';

export interface Distribution {
  id: string;
  org_id: string;
  project_id: string;
  activity_id?: string;
  branch_id?: string;
  office_id?: string;
  name: string;
  distribution_type: DistributionType;
  status: 'planned' | 'ongoing' | 'completed';
  distribution_date: string;
  location?: string;
  created_by: string;
  created_at: string;
}

export interface DistributionItem {
  id: string;
  org_id: string;
  distribution_id: string;
  item_name: string;
  quantity: number;
  unit: string;
  unit_value?: number;
  currency?: Currency;
}

export interface DistributionRecipient {
  id: string;
  org_id: string;
  distribution_id: string;
  beneficiary_type: 'individual' | 'household';
  beneficiary_id: string;
  received_at?: string;
  received_by?: string;
  signature_url?: string;
  notes?: string;
}

// Finance
export interface Budget {
  id: string;
  org_id: string;
  project_id: string;
  name: string;
  fiscal_year: number;
  total_usd: number;
  total_ssp: number;
  status: 'draft' | 'approved' | 'active' | 'closed';
  created_by: string;
  created_at: string;
  approved_at?: string;
  approved_by?: string;
}

export interface BudgetLine {
  id: string;
  org_id: string;
  budget_id: string;
  category: string;
  description: string;
  amount_usd: number;
  amount_ssp: number;
  spent_usd: number;
  spent_ssp: number;
}

export interface Expense {
  id: string;
  org_id: string;
  project_id: string;
  budget_id?: string;
  budget_line_id?: string;
  expense_number: string;
  description: string;
  amount: number;
  currency: Currency;
  category: string;
  vendor?: string;
  expense_date: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'paid';
  submitted_by: string;
  created_at: string;
}

export interface ExpenseAttachment {
  id: string;
  org_id: string;
  expense_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  uploaded_by: string;
  uploaded_at: string;
}

// Procurement
export interface ProcurementRequest {
  id: string;
  org_id: string;
  project_id?: string;
  request_number: string;
  title: string;
  description?: string;
  estimated_amount: number;
  currency: Currency;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'completed';
  requested_by: string;
  created_at: string;
}

export interface PurchaseOrder {
  id: string;
  org_id: string;
  procurement_request_id: string;
  po_number: string;
  vendor: string;
  total_amount: number;
  currency: Currency;
  status: 'draft' | 'issued' | 'received' | 'completed';
  issued_by: string;
  issued_at?: string;
  created_at: string;
}

// Assets & Inventory
export interface Asset {
  id: string;
  org_id: string;
  branch_id?: string;
  office_id?: string;
  asset_tag: string;
  name: string;
  category: string;
  description?: string;
  purchase_date?: string;
  purchase_value?: number;
  currency?: Currency;
  current_value?: number;
  status: 'active' | 'maintenance' | 'disposed';
  assigned_to?: string;
  location?: string;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  org_id: string;
  branch_id?: string;
  office_id?: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  reorder_level?: number;
  created_at: string;
  updated_at: string;
}

export interface InventoryTransaction {
  id: string;
  org_id: string;
  inventory_item_id: string;
  transaction_type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reference?: string;
  notes?: string;
  created_by: string;
  created_at: string;
}

// Documents
export interface Document {
  id: string;
  org_id: string;
  project_id?: string;
  title: string;
  description?: string;
  category: string;
  file_path: string;
  file_type: string;
  file_size: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'archived';
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentVersion {
  id: string;
  org_id: string;
  document_id: string;
  version_number: number;
  file_path: string;
  changes?: string;
  created_by: string;
  created_at: string;
}

// Workflows
export interface WorkflowTemplate {
  id: string;
  org_id: string;
  name: string;
  form_type: 'expense' | 'leave' | 'procurement' | 'distribution' | 'document';
  is_active: boolean;
  steps: WorkflowStep[];
  conditions: WorkflowCondition[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowStep {
  order: number;
  name: string;
  approver_type: 'role' | 'user' | 'manager';
  approver_id: string;
  timeout_days?: number;
  can_reject: boolean;
  can_delegate: boolean;
}

export interface WorkflowCondition {
  field: string;
  operator: '>' | '<' | '==' | '!=' | 'contains' | 'in';
  value: any;
  then_steps?: number[];
  skip_steps?: number[];
}

export interface WorkflowInstance {
  id: string;
  org_id: string;
  template_id: string;
  entity_type: string;
  entity_id: string;
  current_step: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  started_at: string;
  completed_at?: string;
  created_by: string;
}

export interface WorkflowAction {
  id: string;
  org_id: string;
  instance_id: string;
  step: number;
  action: 'approve' | 'reject' | 'delegate' | 'comment';
  actor_id: string;
  comment?: string;
  delegated_to?: string;
  created_at: string;
}

// Break Glass Access (for sensitive cases)
export interface BreakGlassRequest {
  id: string;
  org_id: string;
  case_id: string;
  requested_by: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  requested_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
}

export interface AccessGrant {
  id: string;
  org_id: string;
  break_glass_request_id: string;
  user_id: string;
  case_id: string;
  granted_at: string;
  expires_at: string;
  revoked_at?: string;
}

// Audit & Access Logs
export interface AuditLog {
  id: string;
  org_id?: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface AccessLog {
  id: string;
  org_id: string;
  user_id: string;
  case_id: string;
  access_type: 'view' | 'edit' | 'download';
  break_glass_grant_id?: string;
  accessed_at: string;
  ip_address?: string;
}

// Sync Queue (for offline)
export interface SyncQueueItem {
  id: string;
  entity_type: string;
  entity_id: string;
  action: 'create' | 'update' | 'delete';
  data: Record<string, any>;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  retry_count: number;
  created_at: string;
  synced_at?: string;
  error?: string;
}
