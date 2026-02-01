'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import {
    Plus,
    Search,
    Filter,
    Receipt,
    Clock,
    CheckCircle,
    XCircle,
    DollarSign,
    Eye,
    Pencil,
    Trash2,
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
const expenses = [
    {
        id: '1',
        expenseNumber: 'EXP-2024-0045',
        description: 'Vehicle fuel for field visit',
        category: 'Transport',
        project: 'FSL-2024-001',
        amount: 450,
        currency: 'USD',
        status: 'approved',
        submittedBy: 'John Doe',
        submittedAt: '2024-01-28',
        vendor: 'Shell Station',
    },
    {
        id: '2',
        expenseNumber: 'EXP-2024-0044',
        description: 'Office supplies and stationery',
        category: 'Office',
        project: 'Operations',
        amount: 125,
        currency: 'USD',
        status: 'pending',
        submittedBy: 'Jane Smith',
        submittedAt: '2024-01-27',
        vendor: 'Office Mart',
    },
    {
        id: '3',
        expenseNumber: 'EXP-2024-0043',
        description: 'Training workshop catering',
        category: 'Program',
        project: 'WASH-2024-002',
        amount: 890,
        currency: 'USD',
        status: 'pending',
        submittedBy: 'Mike Johnson',
        submittedAt: '2024-01-26',
        vendor: 'Quality Catering',
    },
    {
        id: '4',
        expenseNumber: 'EXP-2024-0042',
        description: 'Accommodation for field trip',
        category: 'Travel',
        project: 'PROT-2024-003',
        amount: 320,
        currency: 'USD',
        status: 'rejected',
        submittedBy: 'Sarah Wilson',
        submittedAt: '2024-01-25',
        vendor: 'Juba Hotel',
        rejectionReason: 'Missing receipts',
    },
    {
        id: '5',
        expenseNumber: 'EXP-2024-0041',
        description: 'Internet and communication',
        category: 'Utilities',
        project: 'Operations',
        amount: 200,
        currency: 'USD',
        status: 'paid',
        submittedBy: 'Admin',
        submittedAt: '2024-01-24',
        vendor: 'MTN',
    },
];

const statusColors: Record<string, string> = {
    draft: 'secondary',
    pending: 'warning',
    approved: 'success',
    rejected: 'destructive',
    paid: 'default',
};

const statusIcons: Record<string, React.ElementType> = {
    draft: Receipt,
    pending: Clock,
    approved: CheckCircle,
    rejected: XCircle,
    paid: DollarSign,
};

interface PageProps {
    params: Promise<{ orgSlug: string }>;
}

export default function ExpensesPage({ params }: PageProps) {
    const { orgSlug } = use(params);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    const filteredExpenses = expenses.filter((e) => {
        if (activeTab === 'pending') return e.status === 'pending';
        if (activeTab === 'approved') return e.status === 'approved' || e.status === 'paid';
        if (activeTab === 'rejected') return e.status === 'rejected';
        return true;
    });

    const formatCurrency = (amount: number, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
        }).format(amount);
    };

    const pendingTotal = expenses
        .filter(e => e.status === 'pending')
        .reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="section-title">Expenses</h1>
                    <p className="section-description">Submit and track expense claims</p>
                </div>
                <Link href={`/app/${orgSlug}/finance/expenses/new`}>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        New Expense
                    </Button>
                </Link>
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
                                {expenses.filter(e => e.status === 'pending').length}
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
                            <p className="text-sm text-slate-500">Pending Amount</p>
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
                                {expenses.filter(e => e.status === 'approved' || e.status === 'paid').length}
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
                                {expenses.filter(e => e.status === 'rejected').length}
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
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="approved">Approved</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search expenses..."
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

            {/* Expenses table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Expense #</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Submitted By</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredExpenses.map((expense) => {
                            const StatusIcon = statusIcons[expense.status];
                            return (
                                <TableRow key={expense.id}>
                                    <TableCell>
                                        <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                                            {expense.expenseNumber}
                                        </code>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{expense.description}</p>
                                            <p className="text-sm text-slate-500">{expense.vendor}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{expense.category}</Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-500">{expense.project}</TableCell>
                                    <TableCell className="font-medium">
                                        {formatCurrency(expense.amount, expense.currency)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={statusColors[expense.status] as 'default' | 'secondary' | 'destructive' | 'success' | 'warning'}
                                            className="flex items-center gap-1 w-fit"
                                        >
                                            <StatusIcon className="w-3 h-3" />
                                            {expense.status}
                                        </Badge>
                                        {expense.rejectionReason && (
                                            <p className="text-xs text-red-500 mt-1">{expense.rejectionReason}</p>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <UserAvatar name={expense.submittedBy} size="sm" />
                                            <span className="text-sm">{expense.submittedBy}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-500 text-sm">
                                        {new Date(expense.submittedAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            {expense.status === 'draft' && (
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Card>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-slate-500">
                    Showing 1-10 of 45 expenses
                </p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                </div>
            </div>
        </div>
    );
}
