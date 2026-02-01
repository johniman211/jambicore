'use client';

import { useState, use } from 'react';
import {
    Plus,
    Search,
    Filter,
    Users,
    Shield,
    MoreHorizontal,
    Mail,
    UserPlus,
    Settings,
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
const users = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.org',
        role: 'org_admin',
        status: 'active',
        branch: 'Juba HQ',
        lastActive: '2024-01-28 14:30',
        joinedAt: '2023-06-15',
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.org',
        role: 'program_manager',
        status: 'active',
        branch: 'Juba HQ',
        lastActive: '2024-01-28 10:15',
        joinedAt: '2023-08-20',
    },
    {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike.johnson@example.org',
        role: 'field_officer',
        status: 'active',
        branch: 'Wau Office',
        lastActive: '2024-01-27 16:45',
        joinedAt: '2023-11-01',
    },
    {
        id: '4',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.org',
        role: 'finance_officer',
        status: 'active',
        branch: 'Juba HQ',
        lastActive: '2024-01-28 09:00',
        joinedAt: '2023-09-10',
    },
    {
        id: '5',
        name: 'Peter Lual',
        email: 'peter.lual@example.org',
        role: 'field_officer',
        status: 'invited',
        branch: 'Malakal Office',
        lastActive: null,
        joinedAt: '2024-01-25',
    },
];

const roleLabels: Record<string, string> = {
    org_admin: 'Organization Admin',
    program_manager: 'Program Manager',
    finance_officer: 'Finance Officer',
    field_officer: 'Field Officer',
    viewer: 'Viewer',
};

const roleColors: Record<string, string> = {
    org_admin: 'destructive',
    program_manager: 'default',
    finance_officer: 'warning',
    field_officer: 'secondary',
    viewer: 'outline',
};

const statusColors: Record<string, string> = {
    active: 'success',
    invited: 'warning',
    disabled: 'secondary',
};

interface PageProps {
    params: Promise<{ orgSlug: string }>;
}

export default function AdminUsersPage({ params }: PageProps) {
    const { orgSlug } = use(params);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="section-title">Users</h1>
                    <p className="section-description">Manage team members and permissions</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite User
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {users.length}
                            </p>
                            <p className="text-sm text-slate-500">Total Users</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {users.filter(u => u.role === 'org_admin').length}
                            </p>
                            <p className="text-sm text-slate-500">Admins</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {users.filter(u => u.status === 'active').length}
                            </p>
                            <p className="text-sm text-slate-500">Active</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                            <Mail className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {users.filter(u => u.status === 'invited').length}
                            </p>
                            <p className="text-sm text-slate-500">Pending Invite</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs and filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="all">All Users</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="invited">Pending</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search users..."
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

            {/* Users table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Branch</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Active</TableHead>
                            <TableHead className="w-16">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <UserAvatar name={user.name} size="md" />
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-xs text-slate-400">{user.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={roleColors[user.role] as 'default' | 'secondary' | 'destructive' | 'warning' | 'outline'}>
                                        {roleLabels[user.role]}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-slate-500">{user.branch}</TableCell>
                                <TableCell>
                                    <Badge variant={statusColors[user.status] as 'default' | 'secondary' | 'destructive' | 'success' | 'warning'}>
                                        {user.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-slate-500 text-sm">
                                    {user.lastActive || 'Never'}
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-slate-500">
                    Showing 1-{users.length} of {users.length} users
                </p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                </div>
            </div>
        </div>
    );
}
