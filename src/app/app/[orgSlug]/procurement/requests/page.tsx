'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import {
    Plus,
    Search,
    Filter,
    ClipboardList,
    Clock,
    CheckCircle,
    XCircle,
    ShoppingCart,
    Eye,
    Pencil,
    DollarSign,
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
const requests = [
    {
        id: '1',
        reference: 'PR-2024-001',
        title: 'Office Supplies Q1',
        description: 'Stationery, printer ink, and office consumables',
        category: 'Office Supplies',
        status: 'pending_approval',
        amount: 1250,
        currency: 'USD',
        requestedBy: 'John Doe',
        requestedDate: '2024-01-28',
        project: 'Operations',
    },
    {
        id: '2',
        reference: 'PR-2024-002',
        title: 'Field Equipment - Tablets',
        description: '5x Samsung Galaxy Tab for field data collection',
        category: 'IT Equipment',
        status: 'approved',
        amount: 3500,
        currency: 'USD',
        requestedBy: 'Jane Smith',
        requestedDate: '2024-01-25',
        project: 'FSL-2024-001',
    },
    {
        id: '3',
        reference: 'PR-2024-003',
        title: 'Vehicle Maintenance',
        description: 'Service and repair for Toyota Land Cruiser',
        category: 'Vehicle',
        status: 'in_progress',
        amount: 890,
        currency: 'USD',
        requestedBy: 'Mike Johnson',
        requestedDate: '2024-01-22',
        project: 'Operations',
    },
    {
        id: '4',
        reference: 'PR-2024-004',
        title: 'Training Materials',
        description: 'Printed manuals and training kits',
        category: 'Supplies',
        status: 'completed',
        amount: 450,
        currency: 'USD',
        requestedBy: 'Sarah Wilson',
        requestedDate: '2024-01-18',
        project: 'WASH-2024-002',
    },
    {
        id: '5',
        reference: 'PR-2024-005',
        title: 'Emergency Shelter Kits',
        description: 'Tarps, ropes, and shelter materials',
        category: 'NFI',
        status: 'rejected',
        amount: 15000,
        currency: 'USD',
        requestedBy: 'Admin',
        requestedDate: '2024-01-15',
        project: 'PROT-2024-003',
        reason: 'Insufficient budget allocation',
    },
];

const statusColors: Record<string, string> = {
    draft: 'secondary',
    pending_approval: 'warning',
    approved: 'success',
    in_progress: 'default',
    completed: 'success',
    rejected: 'destructive',
};

const statusLabels: Record<string, string> = {
    draft: 'Draft',
    pending_approval: 'Pending Approval',
    approved: 'Approved',
    in_progress: 'In Progress',
    completed: 'Completed',
    rejected: 'Rejected',
};

interface PageProps {
    params: Promise<{ orgSlug: string }>;
}

export default function ProcurementPage({ params }: PageProps) {
    const { orgSlug } = use(params);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    const formatCurrency = (amount: number, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
        }).format(amount);
    };

    const pendingCount = requests.filter(r => r.status === 'pending_approval').length;
    const totalPending = requests
        .filter(r => r.status === 'pending_approval')
        .reduce((sum, r) => sum + r.amount, 0);

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="section-title">Procurement</h1>
                    <p className="section-description">Manage procurement requests and orders</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href={`/app/${orgSlug}/procurement/requests/new`}>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            New Request
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                            <ClipboardList className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {requests.length}
                            </p>
                            <p className="text-sm text-slate-500">Total Requests</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {pendingCount}
                            </p>
                            <p className="text-sm text-slate-500">Pending Approval</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                            <ShoppingCart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {requests.filter(r => r.status === 'in_progress').length}
                            </p>
                            <p className="text-sm text-slate-500">In Progress</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                            <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {formatCurrency(totalPending)}
                            </p>
                            <p className="text-sm text-slate-500">Pending Value</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs and filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="all">All Requests</TabsTrigger>
                        <TabsTrigger value="pending">
                            Pending
                            {pendingCount > 0 && (
                                <span className="ml-2 px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
                                    {pendingCount}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search requests..."
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

            {/* Requests table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Reference</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Requested By</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-24">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((request) => (
                            <TableRow key={request.id}>
                                <TableCell>
                                    <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                                        {request.reference}
                                    </code>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p className="font-medium">{request.title}</p>
                                        <p className="text-xs text-slate-400 truncate max-w-[200px]">
                                            {request.description}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{request.category}</Badge>
                                </TableCell>
                                <TableCell className="font-medium">
                                    {formatCurrency(request.amount, request.currency)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <UserAvatar name={request.requestedBy} size="sm" />
                                        <div>
                                            <span className="text-sm">{request.requestedBy}</span>
                                            <p className="text-xs text-slate-400">
                                                {new Date(request.requestedDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-slate-500">{request.project}</TableCell>
                                <TableCell>
                                    <Badge variant={statusColors[request.status] as 'default' | 'secondary' | 'destructive' | 'success' | 'warning'}>
                                        {statusLabels[request.status]}
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
                    Showing 1-{requests.length} of {requests.length} requests
                </p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                </div>
            </div>
        </div>
    );
}
