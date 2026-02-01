'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import {
    Plus,
    Search,
    Filter,
    FileBox,
    Folder,
    File,
    FileText,
    FileImage,
    FileSpreadsheet,
    Download,
    Eye,
    MoreHorizontal,
    Upload,
    FolderOpen,
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
const documents = [
    {
        id: '1',
        name: 'Project Proposal - FSL 2024.pdf',
        type: 'pdf',
        category: 'Proposals',
        project: 'FSL-2024-001',
        size: '2.4 MB',
        uploadedBy: 'John Doe',
        uploadedAt: '2024-01-28',
    },
    {
        id: '2',
        name: 'Beneficiary List - Juba.xlsx',
        type: 'spreadsheet',
        category: 'Data',
        project: 'FSL-2024-001',
        size: '856 KB',
        uploadedBy: 'Jane Smith',
        uploadedAt: '2024-01-27',
    },
    {
        id: '3',
        name: 'Distribution Report Q4.docx',
        type: 'document',
        category: 'Reports',
        project: 'WASH-2024-002',
        size: '1.2 MB',
        uploadedBy: 'Mike Johnson',
        uploadedAt: '2024-01-26',
    },
    {
        id: '4',
        name: 'Site Photos - Wau Camp',
        type: 'folder',
        category: 'Media',
        project: 'PROT-2024-003',
        size: '45.6 MB',
        uploadedBy: 'Sarah Wilson',
        uploadedAt: '2024-01-25',
        itemCount: 24,
    },
    {
        id: '5',
        name: 'Donor Agreement 2024.pdf',
        type: 'pdf',
        category: 'Contracts',
        project: 'Operations',
        size: '3.1 MB',
        uploadedBy: 'Admin',
        uploadedAt: '2024-01-20',
    },
];

const folders = [
    { name: 'Proposals', count: 12, icon: FileText },
    { name: 'Reports', count: 45, icon: FileSpreadsheet },
    { name: 'Contracts', count: 8, icon: File },
    { name: 'Media', count: 156, icon: FileImage },
    { name: 'Templates', count: 23, icon: Folder },
];

const typeIcons: Record<string, React.ElementType> = {
    pdf: FileText,
    document: FileText,
    spreadsheet: FileSpreadsheet,
    image: FileImage,
    folder: FolderOpen,
};

interface PageProps {
    params: Promise<{ orgSlug: string }>;
}

export default function DocumentsPage({ params }: PageProps) {
    const { orgSlug } = use(params);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="section-title">Documents</h1>
                    <p className="section-description">Manage project documents and files</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                        <Folder className="w-4 h-4 mr-2" />
                        New Folder
                    </Button>
                    <Button>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                    </Button>
                </div>
            </div>

            {/* Quick access folders */}
            <div className="grid sm:grid-cols-5 gap-4 mb-8">
                {folders.map((folder) => (
                    <Card key={folder.name} className="cursor-pointer hover:border-indigo-300 transition-colors">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                <folder.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">{folder.name}</p>
                                <p className="text-xs text-slate-500">{folder.count} files</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Storage stats */}
            <Card className="mb-8">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-medium text-slate-900 dark:text-white">Storage Used</h3>
                            <p className="text-sm text-slate-500">2.4 GB of 10 GB</p>
                        </div>
                        <Badge variant="outline">24% used</Badge>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full w-[24%] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                    </div>
                </CardContent>
            </Card>

            {/* Tabs and filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="all">All Files</TabsTrigger>
                        <TabsTrigger value="recent">Recent</TabsTrigger>
                        <TabsTrigger value="shared">Shared with me</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search documents..."
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

            {/* Documents table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Uploaded By</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="w-24">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {documents.map((doc) => {
                            const TypeIcon = typeIcons[doc.type] || File;
                            return (
                                <TableRow key={doc.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${doc.type === 'folder' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                                <TypeIcon className={`w-4 h-4 ${doc.type === 'folder' ? 'text-amber-600' : 'text-slate-600 dark:text-slate-400'}`} />
                                            </div>
                                            <div>
                                                <p className="font-medium">{doc.name}</p>
                                                {doc.itemCount && (
                                                    <p className="text-xs text-slate-400">{doc.itemCount} items</p>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{doc.category}</Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-500">{doc.project}</TableCell>
                                    <TableCell className="text-slate-500">{doc.size}</TableCell>
                                    <TableCell className="text-slate-500">{doc.uploadedBy}</TableCell>
                                    <TableCell className="text-slate-500 text-sm">
                                        {new Date(doc.uploadedAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Download className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="w-4 h-4" />
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
                    Showing 1-5 of 244 documents
                </p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                </div>
            </div>
        </div>
    );
}
