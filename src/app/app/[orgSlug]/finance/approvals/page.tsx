'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import {
    CheckCircle,
    Clock,
    XCircle,
    DollarSign,
    Eye,
    ThumbsUp,
    ThumbsDown,
    Filter,
    Search,
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
import { UserAvatar } from '@/components/ui/avatar';

// Mock data
const approvals = [
    {
        id: '1',
        type: 'expense',
        reference: 'EXP-2024-0044',
        title: 'Office supplies and stationery',
        amount: 125,
        currency: 'USD',
        status: 'pending',
        submittedBy: 'Jane Smith',
        submittedAt: '2024-01-27',
        project: 'Operations',
    },
    {
        id: '2',
        type: 'expense',
        reference: 'EXP-2024-0043',
        title: 'Training workshop catering',
        amount: 890,
        currency: 'USD',
        status: 'pending',
        submittedBy: 'Mike Johnson',
        submittedAt: '2024-01-26',
        project: 'WASH-2024-002',
    },
    {
        id: '3',
        type: 'budget_revision',
        reference: 'BUD-REV-001',
        title: 'Q1 Budget Reallocation',
        amount: 15000,
        currency: 'USD',
        status: 'pending',
        submittedBy: 'Sarah Wilson',
        submittedAt: '2024-01-25',
        project: 'FSL-2024-001',
    },
    {
        id: '4',
        type: 'expense',
        reference: 'EXP-2024-0040',
        title: 'Vehicle rental for field visit',
        amount: 350,
        currency: 'USD',
        status: 'approved',
        submittedBy: 'John Doe',
        submittedAt: '2024-01-24',
        project: 'PROT-2024-003',
        approvedBy: 'Admin',
        approvedAt: '2024-01-25',
    },
    {
        id: '5',
        type: 'procurement',
        reference: 'PR-2024-012',
        title: 'Office Furniture Request',
        amount: 2500,
        currency: 'USD',
        status: 'rejected',
        submittedBy: 'Amy Lee',
        submittedAt: '2024-01-23',
        project: 'Operations',
        rejectedBy: 'Admin',
        rejectedAt: '2024-01-24',
        reason: 'Budget not available',
    },
];

const typeLabels: Record<string, string> = {
    expense: 'Expense',
    budget_revision: 'Budget Revision',
    procurement: 'Procurement',
};

const statusColors: Record<string, string> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'destructive',
};

interface PageProps {
    params: Promise<{ orgSlug: string }>;
}

export default function ApprovalsPage({ params }: PageProps) {
    const { orgSlug } = use(params);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('pending');

    const filteredApprovals = approvals.filter((a) => {
        if (activeTab === 'pending') return a.status === 'pending';
        if (activeTab === 'approved') return a.status === 'approved';
        if (activeTab === 'rejected') return a.status === 'rejected';
        return true;
    });

    const formatCurrency = (amount: number, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
        }).format(amount);
    };

    const pendingCount = approvals.filter(a => a.status === 'pending').length;
    const pendingTotal = approvals
        .filter(a => a.status === 'pending')
        .reduce((sum, a) => sum + a.amount, 0);

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="section-title">Approvals</h1>
                    <p className="section-description">Review and approve pending requests</p>
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
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {pendingCount}
                            </p>
                            <p className="text-sm text-slate-500">Pending</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                            <DollarSign className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {formatCurrency(pendingTotal)}
                            </p>
                            <p className="text-sm text-slate-500">Pending Value</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {approvals.filter(a => a.status === 'approved').length}
                            </p>
                            <p className="text-sm text-slate-500">Approved (MTD)</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30">
                            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {approvals.filter(a => a.status === 'rejected').length}
                            </p>
                            <p className="text-sm text-slate-500">Rejected</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs and filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="pending">
                            Pending
                            {pendingCount > 0 && (
                                <span className="ml-2 px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
                                    {pendingCount}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="approved">Approved</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected</TabsTrigger>
                        <TabsTrigger value="all">All</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search approvals..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                </div>
            </div>

            {/* Approvals table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Reference</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Submitted By</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-24">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredApprovals.map((approval) => (
                            <TableRow key={approval.id}>
                                <TableCell>
                                    <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                                        {approval.reference}
                                    </code>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{typeLabels[approval.type]}</Badge>
                                </TableCell>
                                <TableCell>
                                    <p className="font-medium">{approval.title}</p>
                                </TableCell>
                                <TableCell className="font-medium">
                                    {formatCurrency(approval.amount, approval.currency)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <UserAvatar name={approval.submittedBy} size="sm" />
                                        <div>
                                            <span className="text-sm">{approval.submittedBy}</span>
                                            <p className="text-xs text-slate-400">
                                                {new Date(approval.submittedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-slate-500">{approval.project}</TableCell>
                                <TableCell>
                                    <Badge variant={statusColors[approval.status] as 'default' | 'secondary' | 'destructive' | 'success' | 'warning'}>
                                        {approval.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {approval.status === 'pending' ? (
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                                                <ThumbsUp className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                                                <ThumbsDown className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </div>
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
                    Showing 1-{filteredApprovals.length} of {filteredApprovals.length} approvals
                </p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                </div>
            </div>
        </div>
    );
}
