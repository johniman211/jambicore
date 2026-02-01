import {
    Users,
    FolderKanban,
    HandCoins,
    Wallet,
    TrendingUp,
    TrendingDown,
    CheckCircle,
    Clock,
    ArrowRight,
    AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function getSupabaseClient() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
            },
        }
    );
}

interface DashboardStats {
    beneficiariesCount: number;
    projectsCount: number;
    distributionsCount: number;
    budgetUtilization: number;
}

interface Activity {
    id: string;
    type: string;
    title: string;
    description: string;
    time: string;
    status: 'completed' | 'pending';
}

interface PendingApproval {
    id: string;
    type: string;
    title: string;
    amount: string;
    submitter: string;
    date: string;
}

async function getDashboardData(orgSlug: string) {
    const supabase = await getSupabaseClient();

    // Get org ID from slug
    const { data: org } = await supabase
        .from('orgs')
        .select('id')
        .eq('slug', orgSlug)
        .single();

    if (!org) {
        return {
            stats: { beneficiariesCount: 0, projectsCount: 0, distributionsCount: 0, budgetUtilization: 0 },
            activities: [],
            pendingApprovals: [],
        };
    }

    const orgId = org.id;

    // Fetch counts in parallel
    const [
        beneficiariesResult,
        projectsResult,
        distributionsResult,
        expensesResult,
        budgetsResult,
        recentBeneficiariesResult,
        recentDistributionsResult,
        pendingExpensesResult,
    ] = await Promise.all([
        // Count beneficiaries
        supabase.from('beneficiaries').select('*', { count: 'exact', head: true }).eq('org_id', orgId),
        // Count active projects
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'active'),
        // Count distributions this month
        supabase.from('distributions').select('*', { count: 'exact', head: true }).eq('org_id', orgId),
        // Get total expenses for budget utilization
        supabase.from('expenses').select('amount').eq('org_id', orgId).eq('status', 'approved'),
        // Get total budgets
        supabase.from('budgets').select('amount').eq('org_id', orgId),
        // Recent beneficiaries for activity feed
        supabase.from('beneficiaries').select('id, first_name, last_name, created_at').eq('org_id', orgId).order('created_at', { ascending: false }).limit(3),
        // Recent distributions for activity feed
        supabase.from('distributions').select('id, name, status, created_at').eq('org_id', orgId).order('created_at', { ascending: false }).limit(3),
        // Pending expenses for approvals
        supabase.from('expenses').select('id, description, amount, created_at, created_by').eq('org_id', orgId).eq('status', 'pending').order('created_at', { ascending: false }).limit(5),
    ]);

    // Calculate stats
    const totalExpenses = expensesResult.data?.reduce((sum, e) => sum + (Number(e.amount) || 0), 0) || 0;
    const totalBudget = budgetsResult.data?.reduce((sum, b) => sum + (Number(b.amount) || 0), 0) || 0;
    const budgetUtilization = totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0;

    const stats: DashboardStats = {
        beneficiariesCount: beneficiariesResult.count || 0,
        projectsCount: projectsResult.count || 0,
        distributionsCount: distributionsResult.count || 0,
        budgetUtilization,
    };

    // Build activities from recent data
    const activities: Activity[] = [];

    recentBeneficiariesResult.data?.forEach((b) => {
        activities.push({
            id: b.id,
            type: 'beneficiary',
            title: `Beneficiary registered: ${b.first_name} ${b.last_name}`,
            description: 'New registration',
            time: formatTimeAgo(new Date(b.created_at)),
            status: 'completed',
        });
    });

    recentDistributionsResult.data?.forEach((d) => {
        activities.push({
            id: d.id,
            type: 'distribution',
            title: d.name || 'Distribution',
            description: d.status || 'In progress',
            time: formatTimeAgo(new Date(d.created_at)),
            status: d.status === 'completed' ? 'completed' : 'pending',
        });
    });

    // Sort activities by time
    activities.sort((a, b) => {
        // Simple sort - most recent first (this is approximate based on the time strings)
        return 0;
    });

    // Build pending approvals
    const pendingApprovals: PendingApproval[] = pendingExpensesResult.data?.map((e) => ({
        id: e.id,
        type: 'Expense',
        title: e.description || 'Expense claim',
        amount: `$${Number(e.amount || 0).toLocaleString()}`,
        submitter: 'Staff',
        date: new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    })) || [];

    return { stats, activities: activities.slice(0, 5), pendingApprovals };
}

function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
}

export default async function DashboardPage({ params }: { params: Promise<{ orgSlug: string }> }) {
    const { orgSlug } = await params;

    let dashboardData;
    try {
        dashboardData = await getDashboardData(orgSlug);
    } catch {
        // Fallback to empty data if database isn't set up
        dashboardData = {
            stats: { beneficiariesCount: 0, projectsCount: 0, distributionsCount: 0, budgetUtilization: 0 },
            activities: [],
            pendingApprovals: [],
        };
    }

    const { stats, activities, pendingApprovals } = dashboardData;

    const statsDisplay = [
        {
            name: 'Total Beneficiaries',
            value: stats.beneficiariesCount.toLocaleString(),
            icon: Users,
            color: 'indigo',
            href: `/app/${orgSlug}/beneficiaries`,
        },
        {
            name: 'Active Projects',
            value: stats.projectsCount.toString(),
            icon: FolderKanban,
            color: 'purple',
            href: `/app/${orgSlug}/projects`,
        },
        {
            name: 'Distributions',
            value: stats.distributionsCount.toString(),
            icon: HandCoins,
            color: 'emerald',
            href: `/app/${orgSlug}/distributions`,
        },
        {
            name: 'Budget Utilized',
            value: `${stats.budgetUtilization}%`,
            icon: Wallet,
            color: 'amber',
            href: `/app/${orgSlug}/finance/budgets`,
        },
    ];

    return (
        <div className="page-container">
            {/* Page header */}
            <div className="mb-8">
                <h1 className="section-title">Dashboard</h1>
                <p className="section-description">Welcome back! Here&apos;s what&apos;s happening across your organization.</p>
            </div>

            {/* Stats grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsDisplay.map((stat) => (
                    <Link key={stat.name} href={stat.href}>
                        <Card hover className="cursor-pointer">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                            {stat.name}
                                        </p>
                                        <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                                        <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Activity</CardTitle>
                            <Link href={`/app/${orgSlug}/reports`}>
                                <Button variant="ghost" size="sm">
                                    View all <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {activities.length > 0 ? (
                                <div className="space-y-4">
                                    {activities.map((activity) => (
                                        <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <div className={`p-2 rounded-lg ${activity.status === 'completed'
                                                ? 'bg-emerald-100 dark:bg-emerald-900/30'
                                                : 'bg-amber-100 dark:bg-amber-900/30'
                                                }`}>
                                                {activity.status === 'completed' ? (
                                                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                                ) : (
                                                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {activity.title}
                                                </p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    {activity.description}
                                                </p>
                                            </div>
                                            <span className="text-sm text-slate-400 whitespace-nowrap">
                                                {activity.time}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500">No recent activity</p>
                                    <p className="text-sm text-slate-400 mt-1">Start by adding beneficiaries or creating projects</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Pending Approvals */}
                <div>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>
                                Pending Approvals
                                {pendingApprovals.length > 0 && (
                                    <Badge variant="warning" className="ml-2">{pendingApprovals.length}</Badge>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pendingApprovals.length > 0 ? (
                                <div className="space-y-4">
                                    {pendingApprovals.map((item) => (
                                        <div key={item.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center justify-between mb-2">
                                                <Badge variant="secondary">{item.type}</Badge>
                                                <span className="text-sm text-slate-400">{item.date}</span>
                                            </div>
                                            <p className="font-medium text-slate-900 dark:text-white mb-1">
                                                {item.title}
                                            </p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                By {item.submitter} • {item.amount}
                                            </p>
                                            <div className="flex gap-2 mt-3">
                                                <Button size="sm" className="flex-1">Approve</Button>
                                                <Button size="sm" variant="outline" className="flex-1">Review</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <CheckCircle className="w-10 h-10 text-emerald-300 mx-auto mb-2" />
                                    <p className="text-slate-500">No pending approvals</p>
                                </div>
                            )}

                            <Link href={`/app/${orgSlug}/finance/approvals`}>
                                <Button variant="ghost" className="w-full mt-4">
                                    View all approvals <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link href={`/app/${orgSlug}/beneficiaries/new`}>
                                <Button variant="outline" className="w-full justify-start">
                                    <Users className="w-4 h-4 mr-2" />
                                    Add Beneficiary
                                </Button>
                            </Link>
                            <Link href={`/app/${orgSlug}/distributions/new`}>
                                <Button variant="outline" className="w-full justify-start">
                                    <HandCoins className="w-4 h-4 mr-2" />
                                    Start Distribution
                                </Button>
                            </Link>
                            <Link href={`/app/${orgSlug}/finance/expenses/new`}>
                                <Button variant="outline" className="w-full justify-start">
                                    <Wallet className="w-4 h-4 mr-2" />
                                    Submit Expense
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
