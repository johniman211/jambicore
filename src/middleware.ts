import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Routes that don't require authentication
const publicRoutes = [
    '/',
    '/features',
    '/pricing',
    '/security',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/login',
    '/signup',
    '/reset-password',
    '/auth/callback',
    '/auth/confirm',
];

// Routes that require super admin
const superAdminRoutes = ['/superadmin'];

export async function middleware(request: NextRequest) {
    const { supabaseResponse, user, supabase } = await updateSession(request);
    const pathname = request.nextUrl.pathname;

    // Check if it's a public route
    const isPublicRoute = publicRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    // Allow public routes without auth
    if (isPublicRoute) {
        return supabaseResponse;
    }

    // Check if user is authenticated
    if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    // Check for super admin routes
    const isSuperAdminRoute = superAdminRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isSuperAdminRoute) {
        // Check if user is super admin
        const { data: membership } = await supabase
            .from('memberships')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', 'super_admin')
            .single();

        if (!membership) {
            const url = request.nextUrl.clone();
            url.pathname = '/app';
            return NextResponse.redirect(url);
        }
    }

    // Check for app routes with orgSlug
    if (pathname.startsWith('/app/')) {
        // Allow org selection and creation routes without org verification
        if (pathname === '/app' || pathname === '/app/new') {
            return supabaseResponse;
        }

        const appMode = process.env.APP_MODE || 'saas';

        // Extract orgSlug from path
        const pathParts = pathname.split('/');
        const orgSlug = pathParts[2];

        // Skip verification for routes that don't need an org context
        if (!orgSlug || orgSlug === 'undefined' || orgSlug === 'new') {
            // If no org slug in SaaS mode, redirect to org selection
            if (appMode === 'saas') {
                const url = request.nextUrl.clone();
                url.pathname = '/app';
                return NextResponse.redirect(url);
            } else {
                // In self-hosted mode, use default org
                const defaultOrgSlug = process.env.SELF_HOSTED_ORG_SLUG || 'default';
                const url = request.nextUrl.clone();
                url.pathname = `/app/${defaultOrgSlug}/dashboard`;
                return NextResponse.redirect(url);
            }
        }

        // Verify user has access to this org - but gracefully handle missing tables
        try {
            const { data: org, error: orgError } = await supabase
                .from('orgs')
                .select('id')
                .eq('slug', orgSlug)
                .single();

            // If tables don't exist, allow the request through for demo mode
            if (orgError && (orgError.code === '42P01' || orgError.message?.includes('does not exist'))) {
                return supabaseResponse;
            }

            if (!org) {
                // Org not found - might be a new org that was just created, allow through
                return supabaseResponse;
            }

            const { data: membership, error: memberError } = await supabase
                .from('memberships')
                .select('id, role')
                .eq('user_id', user.id)
                .eq('org_id', org.id)
                .eq('is_active', true)
                .single();

            // If membership table doesn't exist, allow the request through
            if (memberError && (memberError.code === '42P01' || memberError.message?.includes('does not exist'))) {
                return supabaseResponse;
            }

            if (!membership) {
                const url = request.nextUrl.clone();
                url.pathname = '/app';
                return NextResponse.redirect(url);
            }
        } catch {
            // On any error, allow request through for demo mode
            return supabaseResponse;
        }
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
