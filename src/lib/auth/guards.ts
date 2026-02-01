import { createClient } from '@/lib/supabase/server';
import { UserRole, Membership, Profile, Organization } from '@/types';
import { hasPermission, canAccessProtectionCases } from './permissions';
import { redirect } from 'next/navigation';

export interface AuthContext {
    user: {
        id: string;
        email: string;
    };
    profile: Profile | null;
    membership: Membership | null;
    org: Organization | null;
}

// Get current authenticated user
export async function getAuthUser() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return null;
    }

    return user;
}

// Get auth context with org membership
export async function getAuthContext(orgSlug?: string): Promise<AuthContext | null> {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return null;
    }

    // Get profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // If no org slug, return basic context
    if (!orgSlug) {
        return {
            user: { id: user.id, email: user.email! },
            profile,
            membership: null,
            org: null,
        };
    }

    // Get org by slug
    const { data: org } = await supabase
        .from('orgs')
        .select('*')
        .eq('slug', orgSlug)
        .single();

    if (!org) {
        return {
            user: { id: user.id, email: user.email! },
            profile,
            membership: null,
            org: null,
        };
    }

    // Get membership
    const { data: membership } = await supabase
        .from('memberships')
        .select('*')
        .eq('user_id', user.id)
        .eq('org_id', org.id)
        .eq('is_active', true)
        .single();

    return {
        user: { id: user.id, email: user.email! },
        profile,
        membership,
        org,
    };
}

// Require authentication (redirect if not authenticated)
export async function requireAuth() {
    const user = await getAuthUser();
    if (!user) {
        redirect('/login');
    }
    return user;
}

// Require specific permission in org context
export async function requirePermission(orgSlug: string, permission: string) {
    const context = await getAuthContext(orgSlug);

    if (!context) {
        redirect('/login');
    }

    if (!context.membership) {
        redirect('/app');
    }

    if (!hasPermission(context.membership.role as UserRole, permission)) {
        redirect(`/app/${orgSlug}/dashboard?error=unauthorized`);
    }

    return context;
}

// Require protection case access
export async function requireProtectionAccess(orgSlug: string) {
    const context = await getAuthContext(orgSlug);

    if (!context) {
        redirect('/login');
    }

    if (!context.membership) {
        redirect('/app');
    }

    if (!canAccessProtectionCases(context.membership.role as UserRole)) {
        redirect(`/app/${orgSlug}/cases?error=unauthorized`);
    }

    return context;
}

// Check if user has permission (without redirect)
export async function checkPermission(orgSlug: string, permission: string): Promise<boolean> {
    const context = await getAuthContext(orgSlug);

    if (!context || !context.membership) {
        return false;
    }

    return hasPermission(context.membership.role as UserRole, permission);
}

// Get all orgs user has access to
export async function getUserOrgs() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return [];
    }

    const { data: memberships } = await supabase
        .from('memberships')
        .select(`
      id,
      role,
      org:orgs (
        id,
        slug,
        name,
        logo_url
      )
    `)
        .eq('user_id', user.id)
        .eq('is_active', true);

    return memberships || [];
}
