'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    HandCoins,
    ArrowLeft,
    Loader2,
    Calendar,
    MapPin,
    Users,
    Package,
    Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { use } from 'react';

const distributionTypes = [
    { value: 'food', label: 'Food Distribution' },
    { value: 'nfi', label: 'Non-Food Items (NFI)' },
    { value: 'cash', label: 'Cash Transfer' },
    { value: 'voucher', label: 'Voucher' },
    { value: 'seeds', label: 'Seeds & Tools' },
    { value: 'shelter', label: 'Shelter Materials' },
    { value: 'wash', label: 'WASH Supplies' },
    { value: 'other', label: 'Other' },
];

interface PageProps {
    params: Promise<{ orgSlug: string }>;
}

export default function NewDistributionPage({ params }: PageProps) {
    const { orgSlug } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        project: '',
        plannedDate: '',
        location: '',
        targetBeneficiaries: '',
        items: '',
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

        router.push(`/app/${orgSlug}/distributions`);
    };

    return (
        <div className="page-container">
            <Link href={`/app/${orgSlug}/distributions`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
                <ArrowLeft className="w-4 h-4" />
                Back to Distributions
            </Link>

            <div className="max-w-3xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <HandCoins className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Start Distribution
                        </h1>
                        <p className="text-slate-500">
                            Plan a new distribution event
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Distribution Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Distribution Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g., January Food Distribution - Juba"
                                    required
                                />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        <Package className="w-4 h-4 inline mr-1" />
                                        Distribution Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                        required
                                    >
                                        <option value="">Select type...</option>
                                        {distributionTypes.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>
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
                                    </select>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        <Calendar className="w-4 h-4 inline mr-1" />
                                        Planned Date <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="date"
                                        name="plannedDate"
                                        value={formData.plannedDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        <MapPin className="w-4 h-4 inline mr-1" />
                                        Location <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g., Juba POC Site 3"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <Users className="w-4 h-4 inline mr-1" />
                                    Target Beneficiaries
                                </label>
                                <Input
                                    type="number"
                                    name="targetBeneficiaries"
                                    value={formData.targetBeneficiaries}
                                    onChange={handleChange}
                                    placeholder="Number of beneficiaries"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Items & Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Items to Distribute
                                </label>
                                <Textarea
                                    name="items"
                                    value={formData.items}
                                    onChange={handleChange}
                                    placeholder="List items and quantities (e.g., 50kg sorghum, 5L cooking oil, 2kg beans per household)"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Notes
                                </label>
                                <Textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Any additional notes or special instructions..."
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
                                    Create Distribution
                                </>
                            )}
                        </Button>
                        <Link href={`/app/${orgSlug}/distributions`}>
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
