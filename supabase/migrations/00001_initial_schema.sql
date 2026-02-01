-- Jambi Core - Initial Database Schema
-- Organizations, Users, Projects, Beneficiaries, Cases, Finance, and more

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ORGANIZATIONS & STRUCTURE
-- ============================================

-- Organizations (tenants)
CREATE TABLE orgs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  settings JSONB DEFAULT '{
    "default_currency": "USD",
    "fiscal_year_start_month": 1,
    "require_2fa": false,
    "allow_offline": true
  }'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Branches (regional offices under org)
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, code)
);

-- Offices (field offices under branches)
CREATE TABLE offices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  location TEXT,
  coordinates POINT,
  is_field_office BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, code)
);

-- ============================================
-- USER PROFILES & MEMBERSHIPS
-- ============================================

-- User profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  avatar_url TEXT,
  timezone VARCHAR(50) DEFAULT 'UTC',
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Role type
CREATE TYPE user_role AS ENUM (
  'super_admin',
  'org_admin',
  'program_manager',
  'me_officer',
  'finance',
  'hr',
  'procurement',
  'field_officer',
  'data_entry',
  'viewer',
  'auditor',
  'protection_officer'
);

-- Memberships (user -> org -> role)
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  office_id UUID REFERENCES offices(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, org_id)
);

-- ============================================
-- PROJECTS & ACTIVITIES
-- ============================================

CREATE TYPE project_status AS ENUM ('draft', 'active', 'completed', 'suspended');
CREATE TYPE activity_status AS ENUM ('planned', 'ongoing', 'completed');

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  donor VARCHAR(255),
  donor_project_code VARCHAR(100),
  status project_status DEFAULT 'draft',
  start_date DATE NOT NULL,
  end_date DATE,
  budget_usd DECIMAL(15, 2) DEFAULT 0,
  budget_ssp DECIMAL(15, 2) DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, code)
);

-- Activities (under projects)
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status activity_status DEFAULT 'planned',
  start_date DATE,
  end_date DATE,
  budget_usd DECIMAL(15, 2) DEFAULT 0,
  budget_ssp DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, code)
);

-- Indicators (M&E)
CREATE TABLE indicators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  unit VARCHAR(50) NOT NULL,
  baseline_value DECIMAL(15, 2) DEFAULT 0,
  target_value DECIMAL(15, 2) NOT NULL,
  current_value DECIMAL(15, 2) DEFAULT 0,
  frequency VARCHAR(50) DEFAULT 'monthly',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indicator measurements
CREATE TABLE indicator_measurements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  indicator_id UUID NOT NULL REFERENCES indicators(id) ON DELETE CASCADE,
  value DECIMAL(15, 2) NOT NULL,
  measurement_date DATE NOT NULL,
  notes TEXT,
  recorded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BENEFICIARIES
-- ============================================

CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');

-- Individual beneficiaries
CREATE TABLE beneficiaries_individual (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  office_id UUID REFERENCES offices(id) ON DELETE SET NULL,
  beneficiary_code VARCHAR(50),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  gender gender_type,
  date_of_birth DATE,
  phone VARCHAR(50),
  national_id VARCHAR(100),
  qr_code VARCHAR(255),
  household_id UUID,
  is_head_of_household BOOLEAN DEFAULT false,
  address TEXT,
  village VARCHAR(255),
  county VARCHAR(255),
  state VARCHAR(255),
  vulnerability_status VARCHAR(100),
  photo_url TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  version INTEGER DEFAULT 1,
  UNIQUE(org_id, beneficiary_code)
);

-- Households
CREATE TABLE beneficiaries_household (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  office_id UUID REFERENCES offices(id) ON DELETE SET NULL,
  household_id VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  head_id UUID REFERENCES beneficiaries_individual(id),
  address TEXT,
  village VARCHAR(255),
  county VARCHAR(255),
  state VARCHAR(255),
  member_count INTEGER DEFAULT 0,
  vulnerability_status VARCHAR(100),
  qr_code VARCHAR(255),
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  version INTEGER DEFAULT 1,
  UNIQUE(org_id, household_id)
);

-- Household members link
CREATE TABLE household_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  household_id UUID NOT NULL REFERENCES beneficiaries_household(id) ON DELETE CASCADE,
  individual_id UUID NOT NULL REFERENCES beneficiaries_individual(id) ON DELETE CASCADE,
  relationship VARCHAR(50),
  is_head BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(household_id, individual_id)
);

-- Enrollments (beneficiary -> project)
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  beneficiary_type VARCHAR(20) NOT NULL CHECK (beneficiary_type IN ('individual', 'household')),
  beneficiary_id UUID NOT NULL,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  enrolled_by UUID REFERENCES profiles(id),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'withdrawn')),
  withdrawn_at TIMESTAMPTZ,
  withdrawal_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CASE MANAGEMENT (INCLUDING PROTECTION)
-- ============================================

CREATE TYPE case_type AS ENUM ('general', 'gbv', 'child_protection', 'other_protection');
CREATE TYPE case_status AS ENUM ('open', 'in_progress', 'referred', 'closed');
CREATE TYPE case_priority AS ENUM ('low', 'medium', 'high', 'critical');

-- Cases
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  office_id UUID REFERENCES offices(id) ON DELETE SET NULL,
  case_number VARCHAR(50) NOT NULL,
  beneficiary_id UUID REFERENCES beneficiaries_individual(id),
  case_type case_type NOT NULL,
  is_sensitive BOOLEAN GENERATED ALWAYS AS (
    case_type IN ('gbv', 'child_protection', 'other_protection')
  ) STORED,
  status case_status DEFAULT 'open',
  priority case_priority DEFAULT 'medium',
  title VARCHAR(255) NOT NULL,
  description TEXT, -- Sensitive for protection cases
  intake_date DATE DEFAULT CURRENT_DATE,
  assigned_to UUID REFERENCES profiles(id),
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  closure_reason TEXT,
  UNIQUE(org_id, case_number)
);

-- Case notes
CREATE TABLE case_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  content TEXT NOT NULL, -- Encrypted for sensitive cases
  is_private BOOLEAN DEFAULT false,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Case referrals
CREATE TABLE case_referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  referred_to VARCHAR(255) NOT NULL, -- Organization or service name
  referred_to_contact TEXT,
  referred_by UUID NOT NULL REFERENCES profiles(id),
  reason TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'rejected')),
  referral_date DATE DEFAULT CURRENT_DATE,
  response_date DATE,
  response_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DISTRIBUTIONS
-- ============================================

CREATE TYPE distribution_type AS ENUM ('item', 'cash', 'voucher');
CREATE TYPE distribution_status AS ENUM ('planned', 'ongoing', 'completed', 'cancelled');

-- Distributions
CREATE TABLE distributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  office_id UUID REFERENCES offices(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  distribution_type distribution_type NOT NULL,
  status distribution_status DEFAULT 'planned',
  distribution_date DATE NOT NULL,
  location TEXT,
  coordinates POINT,
  total_recipients INTEGER DEFAULT 0,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  version INTEGER DEFAULT 1
);

-- Distribution items
CREATE TABLE distribution_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  distribution_id UUID NOT NULL REFERENCES distributions(id) ON DELETE CASCADE,
  item_name VARCHAR(255) NOT NULL,
  quantity DECIMAL(15, 2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  unit_value DECIMAL(15, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  total_value DECIMAL(15, 2) GENERATED ALWAYS AS (quantity * COALESCE(unit_value, 0)) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Distribution recipients
CREATE TABLE distribution_recipients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  distribution_id UUID NOT NULL REFERENCES distributions(id) ON DELETE CASCADE,
  beneficiary_type VARCHAR(20) NOT NULL CHECK (beneficiary_type IN ('individual', 'household')),
  beneficiary_id UUID NOT NULL,
  received_at TIMESTAMPTZ,
  received_by UUID REFERENCES profiles(id),
  signature_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(distribution_id, beneficiary_type, beneficiary_id)
);

-- ============================================
-- FINANCE
-- ============================================

CREATE TYPE budget_status AS ENUM ('draft', 'pending', 'approved', 'active', 'closed');
CREATE TYPE expense_status AS ENUM ('draft', 'pending', 'approved', 'rejected', 'paid');

-- Budgets
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  fiscal_year INTEGER NOT NULL,
  total_usd DECIMAL(15, 2) DEFAULT 0,
  total_ssp DECIMAL(15, 2) DEFAULT 0,
  spent_usd DECIMAL(15, 2) DEFAULT 0,
  spent_ssp DECIMAL(15, 2) DEFAULT 0,
  status budget_status DEFAULT 'draft',
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES profiles(id),
  UNIQUE(project_id, fiscal_year)
);

-- Budget lines
CREATE TABLE budget_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  line_code VARCHAR(50),
  description TEXT NOT NULL,
  amount_usd DECIMAL(15, 2) DEFAULT 0,
  amount_ssp DECIMAL(15, 2) DEFAULT 0,
  spent_usd DECIMAL(15, 2) DEFAULT 0,
  spent_ssp DECIMAL(15, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expenses
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  budget_id UUID REFERENCES budgets(id) ON DELETE SET NULL,
  budget_line_id UUID REFERENCES budget_lines(id) ON DELETE SET NULL,
  expense_number VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  category VARCHAR(100),
  vendor VARCHAR(255),
  invoice_number VARCHAR(100),
  expense_date DATE NOT NULL,
  status expense_status DEFAULT 'draft',
  notes TEXT,
  submitted_by UUID NOT NULL REFERENCES profiles(id),
  submitted_at TIMESTAMPTZ,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  rejected_by UUID REFERENCES profiles(id),
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, expense_number)
);

-- Expense attachments
CREATE TABLE expense_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_type VARCHAR(100),
  file_size INTEGER,
  attachment_type VARCHAR(50) DEFAULT 'receipt',
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROCUREMENT
-- ============================================

CREATE TYPE procurement_status AS ENUM ('draft', 'pending', 'approved', 'rejected', 'completed', 'cancelled');
CREATE TYPE po_status AS ENUM ('draft', 'issued', 'partial', 'received', 'completed', 'cancelled');

-- Procurement requests
CREATE TABLE procurement_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  request_number VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  justification TEXT,
  estimated_amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  required_by_date DATE,
  status procurement_status DEFAULT 'draft',
  requested_by UUID NOT NULL REFERENCES profiles(id),
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  rejected_by UUID REFERENCES profiles(id),
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, request_number)
);

-- Procurement request items
CREATE TABLE procurement_request_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  request_id UUID NOT NULL REFERENCES procurement_requests(id) ON DELETE CASCADE,
  item_name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity DECIMAL(15, 2) NOT NULL,
  unit VARCHAR(50),
  estimated_unit_price DECIMAL(15, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchase orders
CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  request_id UUID REFERENCES procurement_requests(id) ON DELETE SET NULL,
  po_number VARCHAR(50) NOT NULL,
  vendor VARCHAR(255) NOT NULL,
  vendor_contact TEXT,
  total_amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status po_status DEFAULT 'draft',
  issue_date DATE,
  expected_delivery_date DATE,
  delivery_address TEXT,
  terms TEXT,
  notes TEXT,
  issued_by UUID REFERENCES profiles(id),
  issued_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, po_number)
);

-- ============================================
-- ASSETS & INVENTORY
-- ============================================

CREATE TYPE asset_status AS ENUM ('active', 'maintenance', 'disposed', 'lost');

-- Assets (fixed assets)
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  office_id UUID REFERENCES offices(id) ON DELETE SET NULL,
  asset_tag VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  serial_number VARCHAR(100),
  model VARCHAR(100),
  manufacturer VARCHAR(100),
  purchase_date DATE,
  purchase_value DECIMAL(15, 2),
  current_value DECIMAL(15, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  status asset_status DEFAULT 'active',
  assigned_to UUID REFERENCES profiles(id),
  location TEXT,
  warranty_expires DATE,
  notes TEXT,
  photo_url TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, asset_tag)
);

-- Inventory items
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  office_id UUID REFERENCES offices(id) ON DELETE SET NULL,
  sku VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  unit VARCHAR(50) NOT NULL,
  quantity DECIMAL(15, 2) DEFAULT 0,
  reorder_level DECIMAL(15, 2),
  unit_cost DECIMAL(15, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  storage_location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, sku)
);

-- Inventory transactions
CREATE TABLE inventory_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('in', 'out', 'adjustment')),
  quantity DECIMAL(15, 2) NOT NULL,
  previous_quantity DECIMAL(15, 2),
  new_quantity DECIMAL(15, 2),
  reference_type VARCHAR(50),
  reference_id UUID,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DOCUMENTS
-- ============================================

CREATE TYPE document_status AS ENUM ('draft', 'pending_approval', 'approved', 'archived');

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  file_path TEXT NOT NULL,
  file_type VARCHAR(100),
  file_size INTEGER,
  current_version INTEGER DEFAULT 1,
  status document_status DEFAULT 'draft',
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document versions
CREATE TABLE document_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  changes TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(document_id, version_number)
);

-- ============================================
-- WORKFLOWS
-- ============================================

CREATE TYPE workflow_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
CREATE TYPE workflow_action_type AS ENUM ('approve', 'reject', 'delegate', 'comment', 'return');

-- Workflow templates
CREATE TABLE workflow_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  form_type VARCHAR(50) NOT NULL, -- 'expense', 'leave', 'procurement', 'distribution', 'document'
  is_active BOOLEAN DEFAULT true,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  conditions JSONB DEFAULT '[]'::jsonb,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow instances
CREATE TABLE workflow_instances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES workflow_templates(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  current_step INTEGER DEFAULT 0,
  status workflow_status DEFAULT 'pending',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES profiles(id)
);

-- Workflow actions
CREATE TABLE workflow_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  instance_id UUID NOT NULL REFERENCES workflow_instances(id) ON DELETE CASCADE,
  step INTEGER NOT NULL,
  action workflow_action_type NOT NULL,
  actor_id UUID NOT NULL REFERENCES profiles(id),
  comment TEXT,
  delegated_to UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BREAK GLASS ACCESS (PROTECTION CASES)
-- ============================================

CREATE TYPE break_glass_status AS ENUM ('pending', 'approved', 'rejected', 'expired', 'revoked');

-- Break glass requests
CREATE TABLE break_glass_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES profiles(id),
  reason TEXT NOT NULL,
  status break_glass_status DEFAULT 'pending',
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT
);

-- Access grants
CREATE TABLE access_grants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  break_glass_request_id UUID NOT NULL REFERENCES break_glass_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  granted_by UUID NOT NULL REFERENCES profiles(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  revoked_by UUID REFERENCES profiles(id),
  revoke_reason TEXT
);

-- ============================================
-- AUDIT LOGS
-- ============================================

-- Audit logs (append-only)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES orgs(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Make audit_logs append-only
CREATE RULE audit_logs_no_update AS ON UPDATE TO audit_logs DO INSTEAD NOTHING;
CREATE RULE audit_logs_no_delete AS ON DELETE TO audit_logs DO INSTEAD NOTHING;

-- Access logs (for sensitive data)
CREATE TABLE access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  access_type VARCHAR(20) NOT NULL CHECK (access_type IN ('view', 'edit', 'download')),
  break_glass_grant_id UUID REFERENCES access_grants(id) ON DELETE SET NULL,
  accessed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET
);

-- Make access_logs append-only
CREATE RULE access_logs_no_update AS ON UPDATE TO access_logs DO INSTEAD NOTHING;
CREATE RULE access_logs_no_delete AS ON DELETE TO access_logs DO INSTEAD NOTHING;

-- ============================================
-- INDEXES
-- ============================================

-- Organizations
CREATE INDEX idx_orgs_slug ON orgs(slug);

-- Branches & Offices
CREATE INDEX idx_branches_org ON branches(org_id);
CREATE INDEX idx_offices_org ON offices(org_id);
CREATE INDEX idx_offices_branch ON offices(branch_id);

-- Memberships
CREATE INDEX idx_memberships_user ON memberships(user_id);
CREATE INDEX idx_memberships_org ON memberships(org_id);
CREATE INDEX idx_memberships_active ON memberships(org_id, is_active);

-- Projects & Activities
CREATE INDEX idx_projects_org ON projects(org_id);
CREATE INDEX idx_projects_status ON projects(org_id, status);
CREATE INDEX idx_activities_project ON activities(project_id);
CREATE INDEX idx_indicators_project ON indicators(project_id);

-- Beneficiaries
CREATE INDEX idx_beneficiaries_org ON beneficiaries_individual(org_id);
CREATE INDEX idx_beneficiaries_branch ON beneficiaries_individual(org_id, branch_id);
CREATE INDEX idx_beneficiaries_search ON beneficiaries_individual(org_id, first_name, last_name);
CREATE INDEX idx_households_org ON beneficiaries_household(org_id);
CREATE INDEX idx_enrollments_project ON enrollments(project_id);
CREATE INDEX idx_enrollments_beneficiary ON enrollments(beneficiary_id);

-- Cases
CREATE INDEX idx_cases_org ON cases(org_id);
CREATE INDEX idx_cases_type ON cases(org_id, case_type);
CREATE INDEX idx_cases_sensitive ON cases(org_id, is_sensitive);
CREATE INDEX idx_cases_assigned ON cases(assigned_to);
CREATE INDEX idx_case_notes_case ON case_notes(case_id);

-- Distributions
CREATE INDEX idx_distributions_org ON distributions(org_id);
CREATE INDEX idx_distributions_project ON distributions(project_id);
CREATE INDEX idx_distribution_recipients ON distribution_recipients(distribution_id);

-- Finance
CREATE INDEX idx_budgets_project ON budgets(project_id);
CREATE INDEX idx_budget_lines_budget ON budget_lines(budget_id);
CREATE INDEX idx_expenses_org ON expenses(org_id);
CREATE INDEX idx_expenses_project ON expenses(project_id);
CREATE INDEX idx_expenses_status ON expenses(org_id, status);

-- Procurement
CREATE INDEX idx_procurement_org ON procurement_requests(org_id);
CREATE INDEX idx_purchase_orders_org ON purchase_orders(org_id);

-- Assets & Inventory
CREATE INDEX idx_assets_org ON assets(org_id);
CREATE INDEX idx_inventory_org ON inventory_items(org_id);
CREATE INDEX idx_inventory_tx ON inventory_transactions(inventory_item_id);

-- Documents
CREATE INDEX idx_documents_org ON documents(org_id);
CREATE INDEX idx_documents_project ON documents(project_id);
CREATE INDEX idx_document_versions ON document_versions(document_id);

-- Workflows
CREATE INDEX idx_workflow_templates_org ON workflow_templates(org_id);
CREATE INDEX idx_workflow_instances_org ON workflow_instances(org_id);
CREATE INDEX idx_workflow_instances_entity ON workflow_instances(entity_type, entity_id);
CREATE INDEX idx_workflow_actions_instance ON workflow_actions(instance_id);

-- Break Glass
CREATE INDEX idx_break_glass_case ON break_glass_requests(case_id);
CREATE INDEX idx_access_grants_case ON access_grants(case_id);

-- Audit
CREATE INDEX idx_audit_logs_org ON audit_logs(org_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_access_logs_case ON access_logs(case_id);
CREATE INDEX idx_access_logs_user ON access_logs(user_id);

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON orgs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON branches FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON offices FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON activities FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON indicators FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON beneficiaries_individual FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON beneficiaries_household FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON cases FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON distributions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON budget_lines FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON procurement_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON purchase_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON inventory_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON workflow_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- CREATE PROFILE ON SIGNUP
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
