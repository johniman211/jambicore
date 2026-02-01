import Link from 'next/link';
import {
    Plus,
    Search,
    Filter,
    Users,
    DollarSign,
    Activity,
    ArrowRight,
    FolderKanban,
    AlertCircle,
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

interface Project {
    id: string;
    code: string;
    name: string;
    donor: string | null;
    status: string;
    start_date: string | null;
    end_date: string | null;
    budget: number;
    spent: number;
    beneficiary_count: number;
}

async function getProjectsData(orgSlug: string) {
    const supabase = await getSupabaseClient();

    // Get org ID from slug
    const { data: org } = await supabase
        .from('orgs')
        .select('id')
        .eq('slug', orgSlug)
        .single();

    if (!org) {
        return { projects: [], stats: { active: 0, totalBudget: 0, beneficiaries: 0, activities: 0 } };
    }

    const orgId = org.id;

    // Fetch projects
    const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false });

    if (error || !projects) {
        return { projects: [], stats: { active: 0, totalBudget: 0, beneficiaries: 0, activities: 0 } };
    }

    // Get beneficiary counts per project
    const projectsWithData = await Promise.all(projects.map(async (p) => {
        const { count: beneficiaryCount } = await supabase
            .from('beneficiaries')
            .select('*', { count: 'exact', head: true })
            .eq('project_id', p.id);

        return {
            id: p.id,
            code: p.code || `PRJ-${p.id.substring(0, 8).toUpperCase()}`,
            name: p.name,
            donor: p.donor,
            status: p.status || 'active',
            start_date: p.start_date,
            end_date: p.end_date,
            budget: Number(p.budget) || 0,
            spent: Number(p.spent) || 0,
            beneficiary_count: beneficiaryCount || 0,
        };
    }));

    const stats = {
        active: projectsWithData.filter(p => p.status === 'active').length,
        totalBudget: projectsWithData.reduce((sum, p) => sum + p.budget, 0),
        beneficiaries: projectsWithData.reduce((sum, p) => sum + p.beneficiary_count, 0),
        activities: projectsWithData.length * 4, // Estimated
    };

    return { projects: projectsWithData, stats };
}

const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
        return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
        return `$${(amount / 1000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
};

const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export default async function ProjectsPage({ params }: { params: Promise<{ orgSlug: string }> }) {
    const { orgSlug } = await params;

    let projectsData;
    try {
        projectsData = await getProjectsData(orgSlug);
    } catch {
        projectsData = { projects: [], stats: { active: 0, totalBudget: 0, beneficiaries: 0, activities: 0 } };
    }

    const { projects, stats } = projectsData;

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="section-title">Projects</h1>
                    <p className="section-description">Manage your organization&apos;s projects and activities</p>
                </div>
                <Link href={`/app/${orgSlug}/projects/new`}>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        New Project
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Active Projects</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.active}</p>
                            </div>
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                <Activity className="w-5 h-5 text-emerald-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Total Budget</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(stats.totalBudget)}</p>
                            </div>
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                <DollarSign className="w-5 h-5 text-indigo-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Beneficiaries</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.beneficiaries.toLocaleString()}</p>
                            </div>
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <Users className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Total Projects</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{projects.length}</p>
                            </div>
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                <FolderKanban className="w-5 h-5 text-amber-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs and filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <Tabs defaultValue="all">
                    <TabsList>
                        <TabsTrigger value="all">All Projects</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input placeholder="Search projects..." className="pl-9" />
                    </div>
                    <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                </div>
            </div>

            {/* Projects grid */}
            {projects.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => {
                        const progress = project.budget > 0 ? Math.round((project.spent / project.budget) * 100) : 0;

                        return (
                            <Card key={project.id} hover className="overflow-hidden">
                                <div className={`h-2 ${project.status === 'active' ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-slate-300'}`} />
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <Badge variant={project.status === 'active' ? 'success' : 'secondary'} className="mb-2">
                                                {project.status}
                                            </Badge>
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                {project.name}
                                            </h3>
                                            <p className="text-sm text-slate-500">{project.code}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        {project.donor && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-500">Donor</span>
                                                <span className="font-medium text-slate-900 dark:text-white">{project.donor}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500">Period</span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {formatDate(project.start_date)} - {formatDate(project.end_date)}
                                            </span>
                                        </div>
                                    </div>

                                    {project.budget > 0 && (
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between text-sm mb-1">
                                                <span className="text-slate-500">Budget Utilized</span>
                                                <span className="font-medium">{progress}%</span>
                                            </div>
                                            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                                                <span>{formatCurrency(project.spent)} spent</span>
                                                <span>{formatCurrency(project.budget)} total</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                {project.beneficiary_count.toLocaleString()}
                                            </span>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            View <ArrowRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-12 text-center">
                        <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                            No Projects Yet
                        </h3>
                        <p className="text-slate-500 mb-6">
                            Create your first project to start tracking activities and budgets.
                        </p>
                        <Link href={`/app/${orgSlug}/projects/new`}>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create First Project
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
