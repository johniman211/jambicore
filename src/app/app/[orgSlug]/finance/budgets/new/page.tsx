'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    DollarSign,
    ArrowLeft,
    Loader2,
    Calendar,
    Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { use } from 'react';

const currencies = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'SSP', label: 'SSP - South Sudanese Pound' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
];

interface PageProps {
    params: Promise<{ orgSlug: string }>;
}

export default function NewBudgetPage({ params }: PageProps) {
    const { orgSlug } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        project: '',
        fiscalYear: new Date().getFullYear().toString(),
        totalUsd: '',
        totalSsp: '',
        description: '',
        notes: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate saving
        await new Promise(resolve => setTimeout(resolve, 1000));

        router.push(`/app/${orgSlug}/finance/budgets`);
    };

    return (
        <div className="page-container">
            <Link href={`/app/${orgSlug}/finance/budgets`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
                <ArrowLeft className="w-4 h-4" />
                Back to Budgets
            </Link>

            <div className="max-w-3xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Create New Budget
                        </h1>
                        <p className="text-slate-500">
                            Set up a new budget for a project or operation
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Budget Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Budget Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g., Food Security Program 2024"
                                    required
                                />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Linked Project
                                    </label>
                                    <select
                                        name="project"
                                        value={formData.project}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    >
                                        <option value="">Select project...</option>
                                        <option value="fsl-2024">FSL-2024-001 - Food Security Program</option>
                                        <option value="wash-2024">WASH-2024-002 - Water & Sanitation</option>
                                        <option value="prot-2024">PROT-2024-003 - Child Protection</option>
                                        <option value="operations">Operations</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        <Calendar className="w-4 h-4 inline mr-1" />
                                        Fiscal Year <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="fiscalYear"
                                        value={formData.fiscalYear}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                        required
                                    >
                                        <option value="2024">2024</option>
                                        <option value="2025">2025</option>
                                        <option value="2026">2026</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Description
                                </label>
                                <Textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Brief description of this budget..."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Budget Amounts</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        <DollarSign className="w-4 h-4 inline mr-1" />
                                        Total USD Amount <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="number"
                                        name="totalUsd"
                                        value={formData.totalUsd}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Total SSP Amount (optional)
                                    </label>
                                    <Input
                                        type="number"
                                        name="totalSsp"
                                        value={formData.totalSsp}
                                        onChange={handleChange}
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <p className="text-sm text-slate-500">
                                    💡 <strong>Tip:</strong> You can add individual budget lines after creating the budget. Budget lines allow you to track spending by category (e.g., Personnel, Travel, Equipment).
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Notes
                                </label>
                                <Textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Any additional notes..."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={loading} className="flex-1 sm:flex-none">
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Create Budget
                                </>
                            )}
                        </Button>
                        <Link href={`/app/${orgSlug}/finance/budgets`}>
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
