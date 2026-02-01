import { CaseType } from '@/types';
import { isOnline } from './sync';

// Protection case types that are online-only
const SENSITIVE_CASE_TYPES: CaseType[] = ['gbv', 'child_protection', 'other_protection'];

// Check if a case type is sensitive/protected
export function isSensitiveCaseType(caseType: CaseType): boolean {
    return SENSITIVE_CASE_TYPES.includes(caseType);
}

// Check if protection case operations are allowed
export function canAccessProtectionCase(): { allowed: boolean; reason?: string } {
    if (!isOnline()) {
        return {
            allowed: false,
            reason: 'Protection cases can only be accessed when online for security reasons.',
        };
    }
    return { allowed: true };
}

// Check if can create protection case
export function canCreateProtectionCase(): { allowed: boolean; reason?: string } {
    if (!isOnline()) {
        return {
            allowed: false,
            reason: 'Protection cases cannot be created offline. Please connect to the internet.',
        };
    }
    return { allowed: true };
}

// Check if can edit protection case
export function canEditProtectionCase(): { allowed: boolean; reason?: string } {
    if (!isOnline()) {
        return {
            allowed: false,
            reason: 'Protection cases cannot be edited offline. Please connect to the internet.',
        };
    }
    return { allowed: true };
}

// Check if can view protection case attachments
export function canViewProtectionAttachments(): { allowed: boolean; reason?: string } {
    if (!isOnline()) {
        return {
            allowed: false,
            reason: 'Protection case attachments are not available offline.',
        };
    }
    return { allowed: true };
}

// Get redacted case view (for unauthorized users)
export function getRedactedCaseView(caseData: any): any {
    return {
        id: caseData.id,
        case_number: caseData.case_number,
        case_type: caseData.case_type,
        status: caseData.status,
        is_sensitive: true,
        title: '[REDACTED - Sensitive Case]',
        description: null,
        created_at: caseData.created_at,
        // All other fields are hidden
    };
}

// Offline guard hook for React components
export function useProtectionGuard() {
    const online = typeof window !== 'undefined' ? navigator.onLine : true;

    return {
        isOnline: online,
        canAccessProtection: online,
        canCreateProtection: online,
        canEditProtection: online,
        errorMessage: online
            ? null
            : 'Protection cases require an internet connection for security.',
    };
}
