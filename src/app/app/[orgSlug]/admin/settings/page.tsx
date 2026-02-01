'use client';

import { useState } from 'react';
import {
    Building2,
    Users,
    Shield,
    Bell,
    Palette,
    Globe,
    Database,
    Key,
    Mail,
    Smartphone,
    Save,
    RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface PageProps {
    params: Promise<{ orgSlug: string }>;
}

export default function SettingsPage({ params }: PageProps) {
    const [activeTab, setActiveTab] = useState('general');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        // Simulate save
        await new Promise(r => setTimeout(r, 1000));
        setSaving(false);
    };

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="section-title">Settings</h1>
                    <p className="section-description">Manage organization settings and preferences</p>
                </div>
                <Button onClick={handleSave} loading={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar navigation */}
                <div className="lg:w-64 flex-shrink-0">
                    <nav className="space-y-1">
                        {[
                            { id: 'general', label: 'General', icon: Building2 },
                            { id: 'security', label: 'Security', icon: Shield },
                            { id: 'notifications', label: 'Notifications', icon: Bell },
                            { id: 'branding', label: 'Branding', icon: Palette },
                            { id: 'integrations', label: 'Integrations', icon: Globe },
                            { id: 'data', label: 'Data & Export', icon: Database },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === item.id
                                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content area */}
                <div className="flex-1 min-w-0">
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Organization Details</CardTitle>
                                    <CardDescription>Basic information about your organization</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Organization Name
                                            </label>
                                            <Input defaultValue="Demo NGO" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Slug
                                            </label>
                                            <Input defaultValue="demo-ngo" disabled />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Logo
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                                                DN
                                            </div>
                                            <Button variant="outline">Change Logo</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Regional Settings</CardTitle>
                                    <CardDescription>Configure timezone and currency preferences</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Default Currency
                                            </label>
                                            <select className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
                                                <option value="USD">USD - US Dollar</option>
                                                <option value="SSP">SSP - South Sudanese Pound</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Fiscal Year Start
                                            </label>
                                            <select className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
                                                <option value="1">January</option>
                                                <option value="4">April</option>
                                                <option value="7">July</option>
                                                <option value="10">October</option>
                                            </select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Authentication</CardTitle>
                                    <CardDescription>Configure login and security settings</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                                <Key className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Require Two-Factor Authentication</p>
                                                <p className="text-sm text-slate-500">All users must enable 2FA</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 peer-checked:bg-indigo-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                                <Shield className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Session Timeout</p>
                                                <p className="text-sm text-slate-500">Auto-logout after inactivity</p>
                                            </div>
                                        </div>
                                        <select className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
                                            <option value="15">15 minutes</option>
                                            <option value="30">30 minutes</option>
                                            <option value="60">1 hour</option>
                                            <option value="240">4 hours</option>
                                        </select>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Protection Case Settings</CardTitle>
                                    <CardDescription>Configure access for sensitive cases</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <Shield className="w-5 h-5 text-red-600 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-red-800 dark:text-red-200">
                                                    Sensitive Case Access
                                                </p>
                                                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                                    GBV and Child Protection cases are restricted to authorized roles only.
                                                    Break-glass access requires approval from Protection Officers.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Break-Glass Access Duration
                                        </label>
                                        <select className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
                                            <option value="12">12 hours</option>
                                            <option value="24">24 hours</option>
                                            <option value="48">48 hours</option>
                                            <option value="72">72 hours</option>
                                        </select>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'data' && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Data Export</CardTitle>
                                    <CardDescription>Download your organization&apos;s data</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                                            <h4 className="font-medium mb-2">Beneficiary Data</h4>
                                            <p className="text-sm text-slate-500 mb-4">Export all beneficiary records</p>
                                            <Button variant="outline" size="sm">Export CSV</Button>
                                        </div>
                                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                                            <h4 className="font-medium mb-2">Financial Data</h4>
                                            <p className="text-sm text-slate-500 mb-4">Export budgets and expenses</p>
                                            <Button variant="outline" size="sm">Export CSV</Button>
                                        </div>
                                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                                            <h4 className="font-medium mb-2">Full Backup</h4>
                                            <p className="text-sm text-slate-500 mb-4">Download complete database backup</p>
                                            <Button variant="outline" size="sm">Request Backup</Button>
                                        </div>
                                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                                            <h4 className="font-medium mb-2">Audit Logs</h4>
                                            <p className="text-sm text-slate-500 mb-4">Export audit trail</p>
                                            <Button variant="outline" size="sm">Export Logs</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Offline Sync</CardTitle>
                                    <CardDescription>Configure offline data caching</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                                <RefreshCw className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Allow Offline Mode</p>
                                                <p className="text-sm text-slate-500">Enable offline data access for field staff</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-slate-200 peer-checked:bg-indigo-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                        </label>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Other tabs can be added similarly */}
                    {(activeTab === 'notifications' || activeTab === 'branding' || activeTab === 'integrations') && (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    {activeTab === 'notifications' && <Bell className="w-8 h-8 text-slate-400" />}
                                    {activeTab === 'branding' && <Palette className="w-8 h-8 text-slate-400" />}
                                    {activeTab === 'integrations' && <Globe className="w-8 h-8 text-slate-400" />}
                                </div>
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings
                                </h3>
                                <p className="text-slate-500">
                                    Configuration options coming soon
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
