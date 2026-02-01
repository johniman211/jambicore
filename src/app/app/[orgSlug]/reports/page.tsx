'use client';

import { useState } from 'react';
import {
    BarChart3,
    PieChart,
    TrendingUp,
    Download,
    Calendar,
    Filter,
    FileText,
    Users,
    DollarSign,
    HandCoins,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface PageProps {
    params: Promise<{ orgSlug: string }>;
}

// Mock chart data visualization
const BarChartMock = () => (
    <div className="h-64 flex items-end justify-around gap-2 p-4">
        {[65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 40, 95].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                    className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-md transition-all duration-500 hover:from-indigo-500 hover:to-purple-400"
                    style={{ height: `${height}%` }}
                />
                <span className="text-xs text-slate-400">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                </span>
            </div>
        ))}
    </div>
);

const PieChartMock = () => (
    <div className="h-64 flex items-center justify-center">
        <div className="relative w-48 h-48">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="20" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#6366f1" strokeWidth="20"
                    strokeDasharray="125.6 125.6" strokeDashoffset="0" className="transition-all duration-500" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="20"
                    strokeDasharray="75.4 125.6" strokeDashoffset="-125.6" className="transition-all duration-500" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#a855f7" strokeWidth="20"
                    strokeDasharray="50.3 125.6" strokeDashoffset="-201" className="transition-all duration-500" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-2xl font-bold">12,453</p>
                    <p className="text-sm text-slate-500">Total</p>
                </div>
            </div>
        </div>
    </div>
);

const reportTemplates = [
    { id: '1', name: 'Beneficiary Summary', description: 'Overview of all beneficiaries by project', type: 'beneficiary', lastRun: '2 hours ago' },
    { id: '2', name: 'Financial Report', description: 'Budget vs actual spending analysis', type: 'finance', lastRun: '1 day ago' },
    { id: '3', name: 'Distribution Report', description: 'Monthly distribution summary', type: 'distribution', lastRun: '3 days ago' },
    { id: '4', name: 'Donor Report', description: 'Project progress for donor reporting', type: 'donor', lastRun: 'Never' },
    { id: '5', name: 'M&E Indicators', description: 'Progress on project indicators', type: 'me', lastRun: '1 week ago' },
];

export default function ReportsPage({ params }: PageProps) {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="section-title">Reports & Analytics</h1>
                    <p className="section-description">Generate reports and view analytics dashboards</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Date Range
                    </Button>
                    <Button size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList>
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="templates">Report Templates</TabsTrigger>
                    <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard">
                    {/* Key metrics */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                        <Users className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <Badge variant="success" className="text-xs">+12%</Badge>
                                </div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">12,453</p>
                                <p className="text-sm text-slate-500">Total Beneficiaries</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                        <DollarSign className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <Badge variant="success" className="text-xs">+8%</Badge>
                                </div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">$1.2M</p>
                                <p className="text-sm text-slate-500">Budget Utilized</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <HandCoins className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <Badge variant="success" className="text-xs">+28%</Badge>
                                </div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">156</p>
                                <p className="text-sm text-slate-500">Distributions (MTD)</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <Badge variant="warning" className="text-xs">68%</Badge>
                                </div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">24</p>
                                <p className="text-sm text-slate-500">Active Projects</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid lg:grid-cols-2 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                                    Beneficiaries by Month
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <BarChartMock />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PieChart className="w-5 h-5 text-purple-600" />
                                    Beneficiaries by Project
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <PieChartMock />
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-indigo-500" />
                                        <span className="text-sm text-slate-600">FSL Program</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                                        <span className="text-sm text-slate-600">WASH</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-fuchsia-500" />
                                        <span className="text-sm text-slate-600">Protection</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Budget overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Budget Overview by Project</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { name: 'Food Security Program', budget: 450000, spent: 156000, color: 'indigo' },
                                    { name: 'WASH Program', budget: 320000, spent: 89000, color: 'emerald' },
                                    { name: 'Child Protection', budget: 180000, spent: 120000, color: 'amber' },
                                    { name: 'Education', budget: 280000, spent: 210000, color: 'purple' },
                                ].map((project, i) => {
                                    const progress = Math.round((project.spent / project.budget) * 100);
                                    return (
                                        <div key={i}>
                                            <div className="flex items-center justify-between text-sm mb-1">
                                                <span className="font-medium">{project.name}</span>
                                                <span className="text-slate-500">
                                                    ${(project.spent / 1000).toFixed(0)}K / ${(project.budget / 1000).toFixed(0)}K ({progress}%)
                                                </span>
                                            </div>
                                            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full bg-${project.color}-500 rounded-full transition-all duration-500`}
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="templates">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reportTemplates.map((template) => (
                            <Card key={template.id} hover>
                                <CardContent className="p-6">
                                    <div className="p-3 w-fit rounded-xl bg-indigo-100 dark:bg-indigo-900/30 mb-4">
                                        <FileText className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                                        {template.name}
                                    </h3>
                                    <p className="text-sm text-slate-500 mb-4">
                                        {template.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-400">
                                            Last run: {template.lastRun}
                                        </span>
                                        <Button size="sm">Generate</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="scheduled">
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                                Scheduled Reports
                            </h3>
                            <p className="text-slate-500 mb-6">
                                Set up automatic report generation and delivery
                            </p>
                            <Button>Create Schedule</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
