import Link from 'next/link';
import {
    Plus,
    Search,
    Filter,
    Download,
    Upload,
    Eye,
    Pencil,
    Users,
    User,
    QrCode,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { UserAvatar } from '@/components/ui/avatar';
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

interface Beneficiary {
    id: string;
    code: string;
    first_name: string;
    last_name: string;
    gender: string;
    age: number | null;
    county: string | null;
    status: string;
    household_id: string | null;
}

interface Stats {
    total: number;
    households: number;
    activeThisMonth: number;
    newThisWeek: number;
}

async function getBeneficiariesData(orgSlug: string) {
    const supabase = await getSupabaseClient();

    // Get org ID from slug
    const { data: org } = await supabase
        .from('orgs')
        .select('id')
        .eq('slug', orgSlug)
        .single();

    if (!org) {
        return { beneficiaries: [], stats: { total: 0, households: 0, activeThisMonth: 0, newThisWeek: 0 } };
    }

    const orgId = org.id;

    // Calculate dates for filters
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const startOfWeek = new Date(now.setDate(now.getDate() - 7)).toISOString();

    // Fetch data in parallel
    const [
        beneficiariesResult,
        totalCountResult,
        householdCountResult,
        activeMonthResult,
        newWeekResult,
    ] = await Promise.all([
        // Fetch beneficiaries (limit 50 for pagination)
        supabase.from('beneficiaries').select('*').eq('org_id', orgId).order('created_at', { ascending: false }).limit(50),
        // Total count
        supabase.from('beneficiaries').select('*', { count: 'exact', head: true }).eq('org_id', orgId),
        // Household count
        supabase.from('households').select('*', { count: 'exact', head: true }).eq('org_id', orgId),
        // Active this month (beneficiaries created or updated this month)
        supabase.from('beneficiaries').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'active'),
        // New this week
        supabase.from('beneficiaries').select('*', { count: 'exact', head: true }).eq('org_id', orgId).gte('created_at', startOfWeek),
    ]);

    const beneficiaries: Beneficiary[] = (beneficiariesResult.data || []).map((b: any) => ({
        id: b.id,
        code: b.code || `BEN-${b.id.substring(0, 6).toUpperCase()}`,
        first_name: b.first_name || 'Unknown',
        last_name: b.last_name || '',
        gender: b.gender || 'unknown',
        age: b.age || null,
        county: b.county || b.location || null,
        status: b.status || 'active',
        household_id: b.household_id || null,
    }));

    const stats: Stats = {
        total: totalCountResult.count || 0,
        households: householdCountResult.count || 0,
        activeThisMonth: activeMonthResult.count || 0,
        newThisWeek: newWeekResult.count || 0,
    };

    return { beneficiaries, stats };
}

export default async function BeneficiariesPage({ params }: { params: Promise<{ orgSlug: string }> }) {
    const { orgSlug } = await params;

    let data;
    try {
        data = await getBeneficiariesData(orgSlug);
    } catch {
        data = { beneficiaries: [], stats: { total: 0, households: 0, activeThisMonth: 0, newThisWeek: 0 } };
    }

    const { beneficiaries, stats } = data;

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="section-title">Beneficiaries</h1>
                    <p className="section-description">Manage individual beneficiaries and households</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Import
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Link href={`/app/${orgSlug}/beneficiaries/new`}>
                        <Button size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Beneficiary
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats cards */}
            <div className="grid sm:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total.toLocaleString()}</p>
                            <p className="text-sm text-slate-500">Total Individuals</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                            <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.households.toLocaleString()}</p>
                            <p className="text-sm text-slate-500">Households</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                            <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.activeThisMonth.toLocaleString()}</p>
                            <p className="text-sm text-slate-500">Active</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                            <QrCode className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.newThisWeek.toLocaleString()}</p>
                            <p className="text-sm text-slate-500">New This Week</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="individual" className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <TabsList>
                        <TabsTrigger value="individual">Individuals</TabsTrigger>
                        <TabsTrigger value="household">Households</TabsTrigger>
                    </TabsList>

                    {/* Search and filter */}
                    <div className="flex items-center gap-3">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input placeholder="Search beneficiaries..." className="pl-9" />
                        </div>
                        <Button variant="outline" size="sm">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                        </Button>
                    </div>
                </div>

                <TabsContent value="individual">
                    {beneficiaries.length > 0 ? (
                        <>
                            <Card>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Beneficiary</TableHead>
                                            <TableHead>Code</TableHead>
                                            <TableHead>Gender</TableHead>
                                            <TableHead>Age</TableHead>
                                            <TableHead>County</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="w-12"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {beneficiaries.map((person) => (
                                            <TableRow key={person.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <UserAvatar name={`${person.first_name} ${person.last_name}`} size="sm" />
                                                        <div>
                                                            <p className="font-medium">{person.first_name} {person.last_name}</p>
                                                            {person.household_id && (
                                                                <p className="text-xs text-slate-400">Household member</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                                                        {person.code}
                                                    </code>
                                                </TableCell>
                                                <TableCell className="capitalize">{person.gender}</TableCell>
                                                <TableCell>{person.age || '-'}</TableCell>
                                                <TableCell>{person.county || '-'}</TableCell>
                                                <TableCell>
                                                    <Badge variant={person.status === 'active' ? 'success' : 'secondary'}>
                                                        {person.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>

                            {/* Pagination */}
                            <div className="flex items-center justify-between mt-6">
                                <p className="text-sm text-slate-500">
                                    Showing 1-{Math.min(beneficiaries.length, 50)} of {stats.total.toLocaleString()} beneficiaries
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
                                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                                    No Beneficiaries Yet
                                </h3>
                                <p className="text-slate-500 mb-6">
                                    Start by adding your first beneficiary or import from a file.
                                </p>
                                <div className="flex items-center justify-center gap-3">
                                    <Link href={`/app/${orgSlug}/beneficiaries/new`}>
                                        <Button>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Beneficiary
                                        </Button>
                                    </Link>
                                    <Button variant="outline">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Import CSV
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="household">
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                                Household View
                            </h3>
                            <p className="text-slate-500 mb-6">
                                View and manage households with their members
                            </p>
                            <Link href={`/app/${orgSlug}/households`}>
                                <Button>View Households</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
