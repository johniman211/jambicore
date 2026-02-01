'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import {
    Plus,
    Search,
    GitBranch,
    Play,
    Pause,
    Settings,
    Eye,
    Pencil,
    Activity,
    CheckCircle,
    Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const workflows = [
    {
        id: '1',
        name: 'Expense Approval',
        description: 'Route expense claims through approval chain based on amount',
        trigger: 'expense_created',
        status: 'active',
        steps: 3,
        executions: 145,
        lastRun: '2024-01-28 14:30',
    },
    {
        id: '2',
        name: 'Procurement Approval',
        description: 'Multi-level approval for procurement requests',
        trigger: 'procurement_created',
        status: 'active',
        steps: 4,
        executions: 67,
        lastRun: '2024-01-28 10:15',
    },
    {
        id: '3',
        name: 'New Beneficiary Registration',
        description: 'Validate and assign case managers to new beneficiaries',
        trigger: 'beneficiary_created',
        status: 'active',
        steps: 2,
        executions: 312,
        lastRun: '2024-01-27 16:45',
    },
    {
        id: '4',
        name: 'Protection Case Assignment',
        description: 'Automatically assign protection cases to qualified staff',
        trigger: 'case_created',
        status: 'paused',
        steps: 3,
        executions: 45,
        lastRun: '2024-01-20 09:00',
    },
    {
        id: '5',
        name: 'Distribution Completion',
        description: 'Generate reports and notifications when distribution completes',
        trigger: 'distribution_completed',
        status: 'active',
        steps: 2,
        executions: 28,
        lastRun: '2024-01-26 14:00',
    },
];

const triggerLabels: Record<string, string> = {
    expense_created: 'On Expense Created',
    procurement_created: 'On Procurement Created',
    beneficiary_created: 'On Beneficiary Created',
    case_created: 'On Case Created',
    distribution_completed: 'On Distribution Completed',
};

const statusColors: Record<string, string> = {
    active: 'success',
    paused: 'warning',
    draft: 'secondary',
};

interface PageProps {
    params: Promise<{ orgSlug: string }>;
}

export default function AdminWorkflowsPage({ params }: PageProps) {
    const { orgSlug } = use(params);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    const activeWorkflows = workflows.filter(w => w.status === 'active').length;
    const totalExecutions = workflows.reduce((sum, w) => sum + w.executions, 0);

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="section-title">Workflows</h1>
                    <p className="section-description">Automate processes and approvals</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Workflow
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                            <GitBranch className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {workflows.length}
                            </p>
                            <p className="text-sm text-slate-500">Total Workflows</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                            <Play className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {activeWorkflows}
                            </p>
                            <p className="text-sm text-slate-500">Active</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                            <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {totalExecutions}
                            </p>
                            <p className="text-sm text-slate-500">Total Runs</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                            <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                98%
                            </p>
                            <p className="text-sm text-slate-500">Success Rate</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs and filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="all">All Workflows</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="paused">Paused</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search workflows..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
            </div>

            {/* Workflows grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {workflows.map((workflow) => (
                    <Card key={workflow.id} className="hover:border-indigo-200 transition-colors">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${workflow.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                        <GitBranch className={`w-5 h-5 ${workflow.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{workflow.name}</CardTitle>
                                        <Badge variant={statusColors[workflow.status] as 'default' | 'secondary' | 'destructive' | 'success' | 'warning'} className="mt-1">
                                            {workflow.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    {workflow.status === 'active' ? (
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600">
                                            <Pause className="w-4 h-4" />
                                        </Button>
                                    ) : (
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600">
                                            <Play className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500 mb-4">{workflow.description}</p>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-1 text-slate-500">
                                    <Activity className="w-4 h-4" />
                                    <span>{workflow.steps} steps</span>
                                </div>
                                <div className="flex items-center gap-1 text-slate-500">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>{workflow.executions} runs</span>
                                </div>
                                <div className="flex items-center gap-1 text-slate-500">
                                    <Clock className="w-4 h-4" />
                                    <span>{workflow.lastRun}</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <Badge variant="outline" className="text-xs">
                                    {triggerLabels[workflow.trigger]}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
