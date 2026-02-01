'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Wallet,
    ArrowLeft,
    Loader2,
    Calendar,
    DollarSign,
    Upload,
    Save,
    Receipt,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { use } from 'react';

const expenseCategories = [
    { value: 'travel', label: 'Travel & Transport' },
    { value: 'accommodation', label: 'Accommodation' },
    { value: 'supplies', label: 'Office Supplies' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'vehicle', label: 'Vehicle Maintenance' },
    { value: 'communication', label: 'Communication' },
    { value: 'training', label: 'Training & Workshops' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'other', label: 'Other' },
];

interface PageProps {
    params: Promise<{ orgSlug: string }>;
}

export default function NewExpensePage({ params }: PageProps) {
    const { orgSlug } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        amount: '',
        currency: 'USD',
        date: '',
        project: '',
        vendor: '',
        description: '',
        receipt: null as File | null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                receipt: e.target.files![0],
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate saving
        await new Promise(resolve => setTimeout(resolve, 1000));

        router.push(`/app/${orgSlug}/finance/expenses`);
    };

    return (
        <div className="page-container">
            <Link href={`/app/${orgSlug}/finance/expenses`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
                <ArrowLeft className="w-4 h-4" />
                Back to Expenses
            </Link>

            <div className="max-w-3xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                        <Wallet className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Submit Expense
                        </h1>
                        <p className="text-slate-500">
                            Submit an expense claim for reimbursement
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Expense Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g., Field visit transportation"
                                    required
                                />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                        required
                                    >
                                        <option value="">Select category...</option>
                                        {expenseCategories.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        <Calendar className="w-4 h-4 inline mr-1" />
                                        Date <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        <DollarSign className="w-4 h-4 inline mr-1" />
                                        Amount <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Currency
                                    </label>
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    >
                                        <option value="USD">USD - US Dollar</option>
                                        <option value="SSP">SSP - South Sudanese Pound</option>
                                        <option value="EUR">EUR - Euro</option>
                                        <option value="GBP">GBP - British Pound</option>
                                    </select>
                                </div>
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
                                        <option value="">Select project (optional)...</option>
                                        <option value="fsl-2024">FSL-2024-001 - Food Security Program</option>
                                        <option value="wash-2024">WASH-2024-002 - Water & Sanitation</option>
                                        <option value="prot-2024">PROT-2024-003 - Child Protection</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Vendor/Payee
                                    </label>
                                    <Input
                                        name="vendor"
                                        value={formData.vendor}
                                        onChange={handleChange}
                                        placeholder="e.g., ABC Transport Services"
                                    />
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
                                    placeholder="Provide details about this expense..."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Receipt Upload</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors cursor-pointer">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {formData.receipt ? (
                                        <>
                                            <Receipt className="w-8 h-8 text-emerald-500 mb-2" />
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {formData.receipt.name}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                            <p className="text-sm text-slate-500">
                                                <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-slate-400">PDF, PNG, JPG up to 10MB</p>
                                        </>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.png,.jpg,.jpeg"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </CardContent>
                    </Card>

                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={loading} className="flex-1 sm:flex-none">
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Submit Expense
                                </>
                            )}
                        </Button>
                        <Link href={`/app/${orgSlug}/finance/expenses`}>
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
