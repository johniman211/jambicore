import { UserRole } from '@/types';

// Role hierarchy and permissions
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
    super_admin: ['*'], // All permissions
    org_admin: [
        'org:read', 'org:write', 'org:admin',
        'users:read', 'users:write', 'users:admin',
        'projects:read', 'projects:write', 'projects:admin',
        'beneficiaries:read', 'beneficiaries:write',
        'cases:read', 'cases:write', 'cases:sensitive',
        'distributions:read', 'distributions:write',
        'finance:read', 'finance:write', 'finance:approve',
        'procurement:read', 'procurement:write', 'procurement:approve',
        'assets:read', 'assets:write',
        'documents:read', 'documents:write', 'documents:approve',
        'reports:read', 'reports:export',
        'workflows:read', 'workflows:write',
        'audit:read',
    ],
    program_manager: [
        'org:read',
        'projects:read', 'projects:write',
        'beneficiaries:read', 'beneficiaries:write',
        'cases:read', 'cases:write',
        'distributions:read', 'distributions:write',
        'finance:read',
        'reports:read', 'reports:export',
    ],
    me_officer: [
        'org:read',
        'projects:read',
        'beneficiaries:read',
        'distributions:read',
        'reports:read', 'reports:export',
        'indicators:read', 'indicators:write',
    ],
    finance: [
        'org:read',
        'projects:read',
        'finance:read', 'finance:write', 'finance:approve',
        'reports:read', 'reports:export',
    ],
    hr: [
        'org:read',
        'users:read', 'users:write',
        'leave:read', 'leave:write', 'leave:approve',
    ],
    procurement: [
        'org:read',
        'projects:read',
        'procurement:read', 'procurement:write',
        'assets:read', 'assets:write',
    ],
    field_officer: [
        'org:read',
        'projects:read',
        'beneficiaries:read', 'beneficiaries:write',
        'cases:read', 'cases:write',
        'distributions:read', 'distributions:write',
    ],
    data_entry: [
        'org:read',
        'projects:read',
        'beneficiaries:read', 'beneficiaries:write',
        'distributions:read', 'distributions:write',
    ],
    viewer: [
        'org:read',
        'projects:read',
        'beneficiaries:read',
        'distributions:read',
        'reports:read',
    ],
    auditor: [
        'org:read',
        'projects:read',
        'beneficiaries:read',
        'cases:read', 'cases:sensitive',
        'distributions:read',
        'finance:read',
        'procurement:read',
        'assets:read',
        'documents:read',
        'reports:read', 'reports:export',
        'audit:read',
    ],
    protection_officer: [
        'org:read',
        'beneficiaries:read',
        'cases:read', 'cases:write', 'cases:sensitive',
    ],
};

// Roles that can access sensitive protection cases
export const PROTECTION_ROLES: UserRole[] = [
    'super_admin',
    'org_admin',
    'protection_officer',
    'auditor',
];

// Check if a role has a specific permission
export function hasPermission(role: UserRole, permission: string): boolean {
    const permissions = ROLE_PERMISSIONS[role];
    if (!permissions) return false;
    if (permissions.includes('*')) return true;
    return permissions.includes(permission);
}

// Check if role can access protection cases
export function canAccessProtectionCases(role: UserRole): boolean {
    return PROTECTION_ROLES.includes(role);
}

// Get display name for role
export function getRoleDisplayName(role: UserRole): string {
    const names: Record<UserRole, string> = {
        super_admin: 'Super Admin',
        org_admin: 'Organization Admin',
        program_manager: 'Program Manager',
        me_officer: 'M&E Officer',
        finance: 'Finance',
        hr: 'Human Resources',
        procurement: 'Procurement',
        field_officer: 'Field Officer',
        data_entry: 'Data Entry',
        viewer: 'Viewer',
        auditor: 'Auditor',
        protection_officer: 'Protection Officer',
    };
    return names[role] || role;
}

// Get all available roles for org admins to assign
export function getAssignableRoles(currentRole: UserRole): UserRole[] {
    if (currentRole === 'super_admin') {
        return Object.keys(ROLE_PERMISSIONS) as UserRole[];
    }
    if (currentRole === 'org_admin') {
        return Object.keys(ROLE_PERMISSIONS).filter(
            (role) => role !== 'super_admin'
        ) as UserRole[];
    }
    return [];
}
