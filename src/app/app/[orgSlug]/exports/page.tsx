'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import {
    Download,
    Search,
    Filter,
    FileSpreadsheet,
    FileText,
    Clock,
    CheckCircle,
    Play,
    Eye,
    RefreshCw,
    Calendar,
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
const exports = [
    {
        id: '1',
        name: 'Beneficiary List - All',
        type: 'xlsx',
        status: 'completed',
        records: 1250,
        fileSize: '2.4 MB',
        requestedBy: 'John Doe',
        createdAt: '2024-01-28 14:30',
        completedAt: '2024-01-28 14:32',
    },
    {
        id: '2',
        name: 'Distribution Report Q4 2023',
        type: 'pdf',
        status: 'completed',
        records: 450,
        fileSize: '5.8 MB',
        requestedBy: 'Jane Smith',
        createdAt: '2024-01-27 10:15',
        completedAt: '2024-01-27 10:18',
    },
    {
        id: '3',
        name: 'Expense Report - January 2024',
        type: 'xlsx',
        status: 'processing',
        records: 89,
        fileSize: null,
        requestedBy: 'Mike Johnson',
        createdAt: '2024-01-28 15:45',
        completedAt: null,
    },
    {
        id: '4',
        name: 'Project Summary Report',
        type: 'pdf',
        status: 'queued',
        records: null,
        fileSize: null,
        requestedBy: 'Sarah Wilson',
        createdAt: '2024-01-28 15:50',
        completedAt: null,
    },
    {
        id: '5',
        name: 'Household Data Export',
        type: 'csv',
        status: 'failed',
        records: null,
        fileSize: null,
        requestedBy: 'Admin',
        createdAt: '2024-01-25 09:00',
        completedAt: null,
        error: 'Timeout - dataset too large',
    },
];

const exportTemplates = [
    { name: 'Beneficiary List', icon: FileSpreadsheet, format: 'XLSX' },
    { name: 'Distribution Report', icon: FileText, format: 'PDF' },
    { name: 'Expense Report', icon: FileSpreadsheet, format: 'XLSX' },
    { name: 'Project Summary', icon: FileText, format: 'PDF' },
    { name: 'Custom Query', icon: FileSpreadsheet, format: 'CSV' },
];

const statusColors: Record<string, string> = {
    queued: 'secondary',
    processing: 'warning',
    completed: 'success',
    failed: 'destructive',
};

const typeIcons: Record<string, React.ElementType> = {
    xlsx: FileSpreadsheet,
    csv: FileSpreadsheet,
    pdf: FileText,
};

interface PageProps {
    params: Promise<{ orgSlug: string }>;
}

export default function ExportsPage({ params }: PageProps) {
    const { orgSlug } = use(params);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="section-title">Exports</h1>
                    <p className="section-description">Generate and download data exports</p>
                </div>
            </div>

            {/* Quick export templates */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Export</h2>
                <div className="grid sm:grid-cols-5 gap-4">
                    {exportTemplates.map((template) => (
                        <Card key={template.name} className="cursor-pointer hover:border-indigo-300 transition-colors group">
                            <CardContent className="p-4 text-center">
                                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg inline-flex mb-3 group-hover:bg-indigo-200 transition-colors">
                                    <template.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <p className="font-medium text-slate-900 dark:text-white text-sm">{template.name}</p>
                                <p className="text-xs text-slate-500">{template.format}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                            <Download className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {exports.filter(e => e.status === 'completed').length}
                            </p>
                            <p className="text-sm text-slate-500">Available</p>
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
                                {exports.filter(e => e.status === 'processing' || e.status === 'queued').length}
                            </p>
                            <p className="text-sm text-slate-500">In Progress</p>
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
                                24
                            </p>
                            <p className="text-sm text-slate-500">This Month</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                7 days
                            </p>
                            <p className="text-sm text-slate-500">Retention</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs and filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="all">All Exports</TabsTrigger>
                        <TabsTrigger value="completed">Ready</TabsTrigger>
                        <TabsTrigger value="processing">Processing</TabsTrigger>
                        <TabsTrigger value="failed">Failed</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search exports..."
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

            {/* Exports table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Export Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Records</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Requested By</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-24">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {exports.map((exp) => {
                            const TypeIcon = typeIcons[exp.type] || FileSpreadsheet;
                            return (
                                <TableRow key={exp.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                                <TypeIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                            </div>
                                            <span className="font-medium">{exp.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="uppercase">{exp.type}</Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-500">
                                        {exp.records ? exp.records.toLocaleString() : '-'}
                                    </TableCell>
                                    <TableCell className="text-slate-500">{exp.fileSize || '-'}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <UserAvatar name={exp.requestedBy} size="sm" />
                                            <span className="text-sm">{exp.requestedBy}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-500 text-sm">
                                        {exp.createdAt}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {exp.status === 'processing' && (
                                                <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                                            )}
                                            <Badge variant={statusColors[exp.status] as 'default' | 'secondary' | 'destructive' | 'success' | 'warning'}>
                                                {exp.status}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {exp.status === 'completed' ? (
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600">
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ) : exp.status === 'failed' ? (
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <RefreshCw className="w-4 h-4" />
                                            </Button>
                                        ) : (
                                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                                                <Clock className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Card>

            {/* Info */}
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-500">
                    <strong>Note:</strong> Export files are retained for 7 days before automatic deletion.
                    Large exports may take several minutes to process.
                </p>
            </div>
        </div>
    );
}
