import Link from 'next/link';
import {
    Plus,
    Search,
    Filter,
    DollarSign,
    PieChart,
    ArrowRight,
    Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

interface Budget {
    id: string;
    name: string;
    project_name: string | null;
    fiscal_year: number;
    status: string;
    total_amount: number;
    spent_amount: number;
}

interface Stats {
    totalBudget: number;
    totalSpent: number;
    utilizationRate: number;
    activeBudgets: number;
}

const statusColors: Record<string, string> = {
    draft: 'secondary',
    pending: 'warning',
    approved: 'default',
    active: 'success',
    closed: 'secondary',
};

async function getBudgetsData(orgSlug: string) {
    const supabase = await getSupabaseClient();

    // Get org ID from slug
    const { data: org } = await supabase
        .from('orgs')
        .select('id')
        .eq('slug', orgSlug)
        .single();

    if (!org) {
        return { budgets: [], stats: { totalBudget: 0, totalSpent: 0, utilizationRate: 0, activeBudgets: 0 } };
    }

    const orgId = org.id;

    // Fetch budgets
    const { data: budgetsData } = await supabase
        .from('budgets')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false });

    const budgets: Budget[] = (budgetsData || []).map((b: any) => ({
        id: b.id,
        name: b.name || 'Unnamed Budget',
        project_name: b.project_name,
        fiscal_year: b.fiscal_year || new Date().getFullYear(),
        status: b.status || 'draft',
        total_amount: Number(b.amount) || 0,
        spent_amount: Number(b.spent) || 0,
    }));

    const totalBudget = budgets.reduce((sum, b) => sum + b.total_amount, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent_amount, 0);
    const activeBudgets = budgets.filter(b => b.status === 'active').length;

    const stats: Stats = {
        totalBudget,
        totalSpent,
        utilizationRate: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0,
        activeBudgets,
    };

    return { budgets, stats };
}

const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
        return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
        return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
};

export default async function BudgetsPage({ params }: { params: Promise<{ orgSlug: string }> }) {
    const { orgSlug } = await params;

    let data;
    try {
        data = await getBudgetsData(orgSlug);
    } catch {
        data = { budgets: [], stats: { totalBudget: 0, totalSpent: 0, utilizationRate: 0, activeBudgets: 0 } };
    }

    const { budgets, stats } = data;

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="section-title">Budgets</h1>
                    <p className="section-description">Manage project budgets and track utilization</p>
                </div>
                <Link href={`/app/${orgSlug}/finance/budgets/new`}>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        New Budget
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                            <DollarSign className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(stats.totalBudget)}</p>
                            <p className="text-sm text-slate-500">Total Budget</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                            <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(stats.totalSpent)}</p>
                            <p className="text-sm text-slate-500">Total Spent</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                            <PieChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.utilizationRate}%</p>
                            <p className="text-sm text-slate-500">Utilization</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                            <DollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.activeBudgets}</p>
                            <p className="text-sm text-slate-500">Active Budgets</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs and filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <Tabs defaultValue="all">
                    <TabsList>
                        <TabsTrigger value="all">All Budgets</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input placeholder="Search budgets..." className="pl-9" />
                    </div>
                    <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                </div>
            </div>

            {/* Budget cards */}
            {budgets.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                    {budgets.map((budget) => {
                        const progress = budget.total_amount > 0
                            ? Math.round((budget.spent_amount / budget.total_amount) * 100)
                            : 0;

                        return (
                            <Card key={budget.id} hover>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <Badge variant={statusColors[budget.status] as 'success' | 'warning' | 'secondary' | 'default'} className="mb-2">
                                                {budget.status}
                                            </Badge>
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                {budget.name}
                                            </h3>
                                            {budget.project_name && (
                                                <p className="text-sm text-slate-500">{budget.project_name}</p>
                                            )}
                                        </div>
                                        <span className="text-sm text-slate-400">FY {budget.fiscal_year}</span>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-slate-500">Utilization</span>
                                            <span className="font-medium">{progress}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${progress > 90
                                                    ? 'bg-red-500'
                                                    : progress > 70
                                                        ? 'bg-amber-500'
                                                        : 'bg-emerald-500'
                                                    }`}
                                                style={{ width: `${Math.min(progress, 100)}%` }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                                            <span>{formatCurrency(budget.spent_amount)} spent</span>
                                            <span>{formatCurrency(budget.total_amount)} total</span>
                                        </div>
                                    </div>

                                    <Button variant="ghost" size="sm" className="w-full">
                                        View Details <ArrowRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-12 text-center">
                        <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                            No Budgets Yet
                        </h3>
                        <p className="text-slate-500 mb-6">
                            Create a budget to start tracking project finances.
                        </p>
                        <Link href={`/app/${orgSlug}/finance/budgets/new`}>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create First Budget
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
