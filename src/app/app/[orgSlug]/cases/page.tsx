import Link from 'next/link';
import {
    Plus,
    Search,
    Filter,
    Shield,
    Lock,
    Eye,
    Clock,
    CheckCircle,
    FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell
} from '@/components/ui/table';
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

interface Case {
    id: string;
    case_number: string;
    title: string;
    type: string;
    status: string;
    priority: string;
    assigned_to: string | null;
    created_at: string;
    beneficiary_name: string | null;
    is_sensitive: boolean;
}

interface Stats {
    open: number;
    inProgress: number;
    protection: number;
    closed: number;
}

const caseTypeColors: Record<string, string> = {
    general: 'secondary',
    gbv: 'destructive',
    child_protection: 'destructive',
    other_protection: 'warning',
};

const caseTypeLabels: Record<string, string> = {
    general: 'General',
    gbv: 'GBV',
    child_protection: 'Child Protection',
    other_protection: 'Protection',
};

const statusColors: Record<string, string> = {
    open: 'warning',
    in_progress: 'default',
    referred: 'secondary',
    closed: 'success',
};

const priorityColors: Record<string, string> = {
    low: 'secondary',
    medium: 'default',
    high: 'warning',
    critical: 'destructive',
};

async function getCasesData(orgSlug: string) {
    const supabase = await getSupabaseClient();

    // Get org ID from slug
    const { data: org } = await supabase
        .from('orgs')
        .select('id')
        .eq('slug', orgSlug)
        .single();

    if (!org) {
        return { cases: [], stats: { open: 0, inProgress: 0, protection: 0, closed: 0 } };
    }

    const orgId = org.id;

    // Fetch cases and counts in parallel
    const [
        casesResult,
        openCountResult,
        inProgressCountResult,
        protectionCountResult,
        closedCountResult,
    ] = await Promise.all([
        supabase.from('cases').select('*').eq('org_id', orgId).order('created_at', { ascending: false }).limit(50),
        supabase.from('cases').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'open'),
        supabase.from('cases').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'in_progress'),
        supabase.from('cases').select('*', { count: 'exact', head: true }).eq('org_id', orgId).in('type', ['gbv', 'child_protection']),
        supabase.from('cases').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'closed'),
    ]);

    const cases: Case[] = (casesResult.data || []).map((c: any) => ({
        id: c.id,
        case_number: c.case_number || `CASE-${c.id.substring(0, 8).toUpperCase()}`,
        title: c.is_sensitive ? '[REDACTED]' : (c.title || 'Untitled Case'),
        type: c.type || 'general',
        status: c.status || 'open',
        priority: c.priority || 'medium',
        assigned_to: c.assigned_to,
        created_at: c.created_at,
        beneficiary_name: c.is_sensitive ? '[REDACTED]' : c.beneficiary_name,
        is_sensitive: c.is_sensitive || c.type === 'gbv' || c.type === 'child_protection',
    }));

    const stats: Stats = {
        open: openCountResult.count || 0,
        inProgress: inProgressCountResult.count || 0,
        protection: protectionCountResult.count || 0,
        closed: closedCountResult.count || 0,
    };

    return { cases, stats };
}

export default async function CasesPage({ params }: { params: Promise<{ orgSlug: string }> }) {
    const { orgSlug } = await params;

    let data;
    try {
        data = await getCasesData(orgSlug);
    } catch {
        data = { cases: [], stats: { open: 0, inProgress: 0, protection: 0, closed: 0 } };
    }

    const { cases, stats } = data;
    const totalCases = cases.length;

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="section-title">Case Management</h1>
                    <p className="section-description">Track and manage beneficiary cases and referrals</p>
                </div>
                <Link href={`/app/${orgSlug}/cases/new`}>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        New Case
                    </Button>
                </Link>
            </div>

            {/* Alert for protection cases */}
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                    <p className="font-medium text-amber-800 dark:text-amber-200">Protection Cases</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                        GBV and Child Protection cases are restricted. They require special authorization and cannot be accessed offline.
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.open}</p>
                            <p className="text-sm text-slate-500">Open Cases</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.inProgress}</p>
                            <p className="text-sm text-slate-500">In Progress</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30">
                            <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.protection}</p>
                            <p className="text-sm text-slate-500">Protection Cases</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.closed}</p>
                            <p className="text-sm text-slate-500">Closed</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs and filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <Tabs defaultValue="all">
                    <TabsList>
                        <TabsTrigger value="all">All Cases</TabsTrigger>
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="protection" className="flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Protection
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input placeholder="Search cases..." className="pl-9" />
                    </div>
                    <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                </div>
            </div>

            {/* Cases table */}
            {cases.length > 0 ? (
                <>
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Case #</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Beneficiary</TableHead>
                                    <TableHead>Assigned To</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cases.map((caseItem) => (
                                    <TableRow key={caseItem.id} className={caseItem.is_sensitive ? 'bg-red-50/50 dark:bg-red-900/10' : ''}>
                                        <TableCell>
                                            <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                                                {caseItem.case_number}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {caseItem.is_sensitive && (
                                                    <Lock className="w-4 h-4 text-red-500" />
                                                )}
                                                <span className={caseItem.is_sensitive ? 'text-slate-400 italic' : ''}>
                                                    {caseItem.title}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={caseTypeColors[caseItem.type] as 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'}>
                                                {caseTypeLabels[caseItem.type] || caseItem.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={priorityColors[caseItem.priority] as 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'}>
                                                {caseItem.priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusColors[caseItem.status] as 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'}>
                                                {caseItem.status.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className={caseItem.is_sensitive ? 'text-slate-400 italic' : ''}>
                                            {caseItem.beneficiary_name || '-'}
                                        </TableCell>
                                        <TableCell>{caseItem.assigned_to || '-'}</TableCell>
                                        <TableCell className="text-slate-500 text-sm">
                                            {new Date(caseItem.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {caseItem.is_sensitive ? (
                                                <Button variant="outline" size="sm" className="text-xs">
                                                    Request Access
                                                </Button>
                                            ) : (
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-6">
                        <p className="text-sm text-slate-500">
                            Showing 1-{Math.min(totalCases, 50)} of {totalCases} cases
                        </p>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" disabled>Previous</Button>
                            <Button variant="outline" size="sm">Next</Button>
                        </div>
                    </div>
                </>
            ) : (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                            No Cases Yet
                        </h3>
                        <p className="text-slate-500 mb-6">
                            Create a case to start tracking beneficiary support and referrals.
                        </p>
                        <Link href={`/app/${orgSlug}/cases/new`}>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create First Case
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
