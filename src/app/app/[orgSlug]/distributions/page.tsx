import Link from 'next/link';
import {
    Plus,
    Search,
    Filter,
    HandCoins,
    Package,
    Banknote,
    Ticket,
    MapPin,
    Calendar,
    Users,
    CheckCircle,
    Clock,
    ArrowRight,
    Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface Distribution {
    id: string;
    name: string;
    type: string;
    status: string;
    date: string;
    location: string | null;
    project_name: string | null;
    recipients_completed: number;
    recipients_total: number;
    total_amount: number | null;
}

interface Stats {
    completed: number;
    ongoing: number;
    planned: number;
    totalRecipients: number;
}

const typeIcons: Record<string, typeof HandCoins> = {
    item: Package,
    cash: Banknote,
    voucher: Ticket,
};

const statusColors: Record<string, string> = {
    completed: 'success',
    ongoing: 'warning',
    planned: 'secondary',
};

async function getDistributionsData(orgSlug: string) {
    const supabase = await getSupabaseClient();

    // Get org ID from slug
    const { data: org } = await supabase
        .from('orgs')
        .select('id')
        .eq('slug', orgSlug)
        .single();

    if (!org) {
        return { distributions: [], stats: { completed: 0, ongoing: 0, planned: 0, totalRecipients: 0 } };
    }

    const orgId = org.id;

    // Fetch distributions and counts in parallel
    const [
        distributionsResult,
        completedCountResult,
        ongoingCountResult,
        plannedCountResult,
    ] = await Promise.all([
        supabase.from('distributions').select('*').eq('org_id', orgId).order('created_at', { ascending: false }).limit(50),
        supabase.from('distributions').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'completed'),
        supabase.from('distributions').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'ongoing'),
        supabase.from('distributions').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'planned'),
    ]);

    const distributions: Distribution[] = (distributionsResult.data || []).map((d: any) => ({
        id: d.id,
        name: d.name || 'Distribution',
        type: d.type || 'item',
        status: d.status || 'planned',
        date: d.distribution_date || d.created_at,
        location: d.location,
        project_name: d.project_name,
        recipients_completed: d.recipients_completed || 0,
        recipients_total: d.recipients_total || 0,
        total_amount: d.total_amount,
    }));

    const totalRecipients = distributions.reduce((sum, d) => sum + d.recipients_completed, 0);

    const stats: Stats = {
        completed: completedCountResult.count || 0,
        ongoing: ongoingCountResult.count || 0,
        planned: plannedCountResult.count || 0,
        totalRecipients,
    };

    return { distributions, stats };
}

export default async function DistributionsPage({ params }: { params: Promise<{ orgSlug: string }> }) {
    const { orgSlug } = await params;

    let data;
    try {
        data = await getDistributionsData(orgSlug);
    } catch {
        data = { distributions: [], stats: { completed: 0, ongoing: 0, planned: 0, totalRecipients: 0 } };
    }

    const { distributions, stats } = data;

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="section-title">Distributions</h1>
                    <p className="section-description">Plan and track distributions to beneficiaries</p>
                </div>
                <Link href={`/app/${orgSlug}/distributions/new`}>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        New Distribution
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.completed}</p>
                            <p className="text-sm text-slate-500">Completed</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                            <Play className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.ongoing}</p>
                            <p className="text-sm text-slate-500">Ongoing</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.planned}</p>
                            <p className="text-sm text-slate-500">Planned</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalRecipients.toLocaleString()}</p>
                            <p className="text-sm text-slate-500">Total Recipients</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs and filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <Tabs defaultValue="all">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                        <TabsTrigger value="planned">Planned</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input placeholder="Search distributions..." className="pl-9" />
                    </div>
                    <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                </div>
            </div>

            {/* Distribution cards */}
            {distributions.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {distributions.map((dist) => {
                        const TypeIcon = typeIcons[dist.type] || Package;
                        const progress = dist.recipients_total > 0
                            ? Math.round((dist.recipients_completed / dist.recipients_total) * 100)
                            : 0;

                        return (
                            <Card key={dist.id} hover className="overflow-hidden">
                                <div className={`h-2 ${dist.status === 'completed'
                                    ? 'bg-emerald-500'
                                    : dist.status === 'ongoing'
                                        ? 'bg-amber-500'
                                        : 'bg-slate-300'
                                    }`} />
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${dist.type === 'cash'
                                                ? 'bg-emerald-100 dark:bg-emerald-900/30'
                                                : dist.type === 'voucher'
                                                    ? 'bg-purple-100 dark:bg-purple-900/30'
                                                    : 'bg-indigo-100 dark:bg-indigo-900/30'
                                                }`}>
                                                <TypeIcon className={`w-5 h-5 ${dist.type === 'cash'
                                                    ? 'text-emerald-600'
                                                    : dist.type === 'voucher'
                                                        ? 'text-purple-600'
                                                        : 'text-indigo-600'
                                                    }`} />
                                            </div>
                                            <div>
                                                <Badge variant={statusColors[dist.status] as 'success' | 'warning' | 'secondary'}>
                                                    {dist.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                        {dist.name}
                                    </h3>

                                    <div className="space-y-2 text-sm text-slate-500 mb-4">
                                        {dist.project_name && (
                                            <p>{dist.project_name}</p>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            {dist.location || 'No location set'}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(dist.date).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {dist.recipients_total > 0 && (
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between text-sm mb-1">
                                                <span className="text-slate-500">Progress</span>
                                                <span className="font-medium">
                                                    {dist.recipients_completed} / {dist.recipients_total}
                                                </span>
                                            </div>
                                            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${dist.status === 'completed'
                                                        ? 'bg-emerald-500'
                                                        : 'bg-indigo-500'
                                                        }`}
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {dist.total_amount && (
                                        <div className="text-sm text-slate-500 mb-4">
                                            Total: ${dist.total_amount.toLocaleString()}
                                        </div>
                                    )}

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
                        <HandCoins className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                            No Distributions Yet
                        </h3>
                        <p className="text-slate-500 mb-6">
                            Create a distribution to start tracking deliveries to beneficiaries.
                        </p>
                        <Link href={`/app/${orgSlug}/distributions/new`}>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create First Distribution
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
