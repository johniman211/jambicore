'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import {
    Plus,
    Search,
    Filter,
    Home,
    Users,
    MapPin,
    Eye,
    Pencil,
    ChevronRight,
    UserCheck,
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

// Mock data
const households = [
    {
        id: '1',
        householdId: 'HH-2024-0001',
        headName: 'Ahmed Hassan',
        phone: '+211 912 345 678',
        location: 'Juba POC',
        county: 'Juba',
        state: 'Central Equatoria',
        members: 7,
        vulnerabilities: ['Female-headed', 'Disabled member'],
        registeredDate: '2024-01-15',
        status: 'active',
    },
    {
        id: '2',
        householdId: 'HH-2024-0002',
        headName: 'Mary Akol Deng',
        phone: '+211 923 456 789',
        location: 'Wau Town',
        county: 'Wau',
        state: 'Western Bahr el Ghazal',
        members: 5,
        vulnerabilities: ['Female-headed', 'Elderly'],
        registeredDate: '2024-01-10',
        status: 'active',
    },
    {
        id: '3',
        householdId: 'HH-2024-0003',
        headName: 'Peter Lual Bol',
        phone: '+211 934 567 890',
        location: 'Malakal POC',
        county: 'Malakal',
        state: 'Upper Nile',
        members: 9,
        vulnerabilities: ['Chronic illness', 'Unaccompanied minors'],
        registeredDate: '2024-01-08',
        status: 'active',
    },
    {
        id: '4',
        householdId: 'HH-2024-0004',
        headName: 'Grace Nyandeng',
        phone: '+211 945 678 901',
        location: 'Bentiu POC',
        county: 'Rubkona',
        state: 'Unity',
        members: 4,
        vulnerabilities: ['Pregnant/Lactating'],
        registeredDate: '2024-01-05',
        status: 'active',
    },
    {
        id: '5',
        householdId: 'HH-2024-0005',
        headName: 'John Machar Gatluak',
        phone: '+211 956 789 012',
        location: 'Bor Town',
        county: 'Bor South',
        state: 'Jonglei',
        members: 6,
        vulnerabilities: [],
        registeredDate: '2023-12-20',
        status: 'inactive',
    },
];

const statusColors: Record<string, string> = {
    active: 'success',
    inactive: 'secondary',
    pending: 'warning',
};

interface PageProps {
    params: Promise<{ orgSlug: string }>;
}

export default function HouseholdsPage({ params }: PageProps) {
    const { orgSlug } = use(params);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    const totalMembers = households.reduce((sum, h) => sum + h.members, 0);

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="section-title">Households</h1>
                    <p className="section-description">Manage registered household groups</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href={`/app/${orgSlug}/households/new`}>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Household
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                            <Home className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {households.length}
                            </p>
                            <p className="text-sm text-slate-500">Total Households</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                            <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {totalMembers}
                            </p>
                            <p className="text-sm text-slate-500">Total Members</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                            <UserCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {households.filter(h => h.status === 'active').length}
                            </p>
                            <p className="text-sm text-slate-500">Active</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                            <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {new Set(households.map(h => h.county)).size}
                            </p>
                            <p className="text-sm text-slate-500">Counties</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs and filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="all">All Households</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="inactive">Inactive</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search households..."
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

            {/* Households table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Household ID</TableHead>
                            <TableHead>Head of Household</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Members</TableHead>
                            <TableHead>Vulnerabilities</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-24">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {households.map((household) => (
                            <TableRow key={household.id}>
                                <TableCell>
                                    <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                                        {household.householdId}
                                    </code>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p className="font-medium">{household.headName}</p>
                                        <p className="text-xs text-slate-400">{household.phone}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p className="font-medium">{household.location}</p>
                                        <p className="text-xs text-slate-400">{household.county}, {household.state}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-slate-400" />
                                        <span>{household.members}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                                        {household.vulnerabilities.length > 0 ? (
                                            household.vulnerabilities.slice(0, 2).map((v, i) => (
                                                <Badge key={i} variant="outline" className="text-xs">
                                                    {v}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-sm text-slate-400">-</span>
                                        )}
                                        {household.vulnerabilities.length > 2 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{household.vulnerabilities.length - 2}
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={statusColors[household.status] as 'default' | 'secondary' | 'destructive' | 'success' | 'warning'}>
                                        {household.status}
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
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <ChevronRight className="w-4 h-4" />
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
                    Showing 1-{households.length} of {households.length} households
                </p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                </div>
            </div>
        </div>
    );
}
