'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import {
    Plus,
    Search,
    Filter,
    Package,
    Laptop,
    Car,
    Building,
    Wrench,
    Eye,
    Pencil,
    QrCode,
    Download,
    AlertTriangle,
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
const assets = [
    {
        id: '1',
        assetTag: 'AST-001',
        name: 'Toyota Land Cruiser',
        category: 'Vehicles',
        status: 'in_use',
        location: 'Juba Office',
        assignedTo: 'Field Team A',
        purchaseDate: '2022-03-15',
        value: 45000,
        condition: 'good',
    },
    {
        id: '2',
        assetTag: 'AST-002',
        name: 'Dell Laptop - XPS 15',
        category: 'IT Equipment',
        status: 'in_use',
        location: 'Juba Office',
        assignedTo: 'John Doe',
        purchaseDate: '2023-06-20',
        value: 1800,
        condition: 'good',
    },
    {
        id: '3',
        assetTag: 'AST-003',
        name: 'Generator 10KVA',
        category: 'Equipment',
        status: 'maintenance',
        location: 'Wau Office',
        assignedTo: null,
        purchaseDate: '2021-09-10',
        value: 5500,
        condition: 'fair',
    },
    {
        id: '4',
        assetTag: 'AST-004',
        name: 'Office Furniture Set',
        category: 'Furniture',
        status: 'in_use',
        location: 'Malakal Office',
        assignedTo: 'Operations',
        purchaseDate: '2023-01-05',
        value: 3200,
        condition: 'good',
    },
    {
        id: '5',
        assetTag: 'AST-005',
        name: 'Motorcycle - Honda',
        category: 'Vehicles',
        status: 'disposed',
        location: 'N/A',
        assignedTo: null,
        purchaseDate: '2019-05-12',
        value: 0,
        condition: 'disposed',
    },
];

const categoryIcons: Record<string, React.ElementType> = {
    'Vehicles': Car,
    'IT Equipment': Laptop,
    'Equipment': Wrench,
    'Furniture': Building,
};

const statusColors: Record<string, string> = {
    in_use: 'success',
    available: 'default',
    maintenance: 'warning',
    disposed: 'secondary',
};

const conditionColors: Record<string, string> = {
    good: 'success',
    fair: 'warning',
    poor: 'destructive',
    disposed: 'secondary',
};

interface PageProps {
    params: Promise<{ orgSlug: string }>;
}

export default function AssetsPage({ params }: PageProps) {
    const { orgSlug } = use(params);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    const filteredAssets = assets.filter((a) => {
        if (activeTab === 'in_use') return a.status === 'in_use';
        if (activeTab === 'maintenance') return a.status === 'maintenance';
        if (activeTab === 'disposed') return a.status === 'disposed';
        return true;
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const totalValue = assets
        .filter(a => a.status !== 'disposed')
        .reduce((sum, a) => sum + a.value, 0);

    const maintenanceCount = assets.filter(a => a.status === 'maintenance').length;

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="section-title">Assets</h1>
                    <p className="section-description">Manage organization assets and inventory</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Link href={`/app/${orgSlug}/assets/new`}>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Asset
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                            <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {assets.filter(a => a.status !== 'disposed').length}
                            </p>
                            <p className="text-sm text-slate-500">Total Assets</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                            <Car className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {assets.filter(a => a.category === 'Vehicles' && a.status !== 'disposed').length}
                            </p>
                            <p className="text-sm text-slate-500">Vehicles</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                            <Laptop className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {formatCurrency(totalValue)}
                            </p>
                            <p className="text-sm text-slate-500">Total Value</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className={maintenanceCount > 0 ? 'border-amber-200 dark:border-amber-800' : ''}>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {maintenanceCount}
                            </p>
                            <p className="text-sm text-slate-500">In Maintenance</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs and filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="all">All Assets</TabsTrigger>
                        <TabsTrigger value="in_use">In Use</TabsTrigger>
                        <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                        <TabsTrigger value="disposed">Disposed</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search assets..."
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

            {/* Assets table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Asset</TableHead>
                            <TableHead>Tag</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Assigned To</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Condition</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-24">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAssets.map((asset) => {
                            const CategoryIcon = categoryIcons[asset.category] || Package;
                            return (
                                <TableRow key={asset.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                                <CategoryIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                            </div>
                                            <span className="font-medium">{asset.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                                            {asset.assetTag}
                                        </code>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{asset.category}</Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-500">{asset.location}</TableCell>
                                    <TableCell className="text-slate-500">{asset.assignedTo || '-'}</TableCell>
                                    <TableCell className="font-medium">
                                        {asset.value > 0 ? formatCurrency(asset.value) : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={conditionColors[asset.condition] as 'default' | 'secondary' | 'destructive' | 'success' | 'warning'}>
                                            {asset.condition}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusColors[asset.status] as 'default' | 'secondary' | 'destructive' | 'success' | 'warning'}>
                                            {asset.status.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <QrCode className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Pencil className="w-4 h-4" />
                                            </Button>
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
                    Showing 1-{filteredAssets.length} of {filteredAssets.length} assets
                </p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                </div>
            </div>
        </div>
    );
}
