'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Building2,
    Plus,
    ArrowRight,
    Loader2,
    LogOut,
    RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createBrowserClient } from '@supabase/ssr';

interface Organization {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    role: string;
    member_count: number;
    project_count: number;
}

export default function AppPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ email?: string; id?: string } | null>(null);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [error, setError] = useState('');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const fetchOrganizations = async (userId: string) => {
        try {
            // Fetch user's memberships with organization details
            const { data: memberships, error: membershipError } = await supabase
                .from('memberships')
                .select(`
          role,
          org:orgs (
            id,
            name,
            slug,
            logo_url
          )
        `)
                .eq('user_id', userId)
                .eq('status', 'active');

            if (membershipError) {
                // Silently handle missing tables - just show empty state
                // This is expected when the database hasn't been set up yet
                setOrganizations([]);
                return;
            }

            if (!memberships || memberships.length === 0) {
                setOrganizations([]);
                return;
            }

            // Transform the data
            const orgs: Organization[] = await Promise.all(
                memberships.map(async (m: any) => {
                    const org = m.org;

                    // Get member count (simplified - just count for this org)
                    const { count: memberCount } = await supabase
                        .from('memberships')
                        .select('*', { count: 'exact', head: true })
                        .eq('org_id', org.id)
                        .eq('status', 'active');

                    // Get project count
                    const { count: projectCount } = await supabase
                        .from('projects')
                        .select('*', { count: 'exact', head: true })
                        .eq('org_id', org.id);

                    return {
                        id: org.id,
                        name: org.name,
                        slug: org.slug,
                        logo_url: org.logo_url,
                        role: m.role,
                        member_count: memberCount || 0,
                        project_count: projectCount || 0,
                    };
                })
            );

            setOrganizations(orgs);
        } catch {
            // Silent fail - show empty state when database isn't ready
            setOrganizations([]);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            setUser(user);
            await fetchOrganizations(user.id);
            setLoading(false);
        };

        checkAuth();
    }, [router]);

    // Auto-redirect if user has exactly one organization
    useEffect(() => {
        if (!loading && organizations.length === 1) {
            router.push(`/app/${organizations[0].slug}/dashboard`);
        }
    }, [loading, organizations, router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const handleRefresh = async () => {
        if (user?.id) {
            setLoading(true);
            await fetchOrganizations(user.id);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">Loading your organizations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">JC</span>
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white">Jambi Core</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-500">{user?.email}</span>
                            <Button variant="ghost" size="sm" onClick={handleRefresh}>
                                <RefreshCw className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleLogout}>
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                        Select Organization
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Choose an organization to access or create a new one
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {organizations.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {organizations.map((org) => (
                            <Card
                                key={org.id}
                                hover
                                className="cursor-pointer group"
                                onClick={() => router.push(`/app/${org.slug}/dashboard`)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0">
                                            {org.logo_url ? (
                                                <img src={org.logo_url} alt={org.name} className="w-full h-full object-cover rounded-xl" />
                                            ) : (
                                                <span className="text-white font-bold text-lg">
                                                    {org.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                                {org.name}
                                            </h3>
                                            <p className="text-sm text-slate-500 capitalize">{org.role.replace(/_/g, ' ')}</p>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                                                <span>{org.member_count} member{org.member_count !== 1 ? 's' : ''}</span>
                                                <span>{org.project_count} project{org.project_count !== 1 ? 's' : ''}</span>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="mb-8">
                        <CardContent className="p-12 text-center">
                            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                                No Organizations Yet
                            </h3>
                            <p className="text-slate-500 mb-6">
                                You haven&apos;t joined any organizations yet. Create one to get started.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Create New Organization */}
                <Link href="/app/new">
                    <Card className="border-dashed border-2 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all cursor-pointer group">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
                                    <Plus className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                        Create New Organization
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        Set up a new organization for your NGO
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {/* Help Section */}
                <div className="mt-12 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Need Help?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        If you were invited to join an organization, please check your email for an invitation link.
                        If you need to join an existing organization, contact your administrator.
                    </p>
                    <div className="flex items-center gap-3">
                        <Link href="/contact">
                            <Button variant="outline" size="sm">Contact Support</Button>
                        </Link>
                        <Link href="/">
                            <Button variant="ghost" size="sm">Back to Home</Button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
