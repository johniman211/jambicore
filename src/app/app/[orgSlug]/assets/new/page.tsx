'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Save,
    Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface PageProps {
    params: Promise<{ orgSlug: string }>;
}

export default function NewAssetPage({ params }: PageProps) {
    const { orgSlug } = use(params);
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSubmitting(false);
        router.push(`/app/${orgSlug}/assets`);
    };

    return (
        <div className="page-container max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href={`/app/${orgSlug}/assets`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="section-title">Add New Asset</h1>
                    <p className="section-description">Register a new asset in the inventory</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Asset Details */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-indigo-600" />
                            Asset Information
                        </CardTitle>
                        <CardDescription>Basic details about the asset</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Asset Name <span className="text-red-500">*</span>
                                </label>
                                <Input placeholder="e.g., Toyota Land Cruiser" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Asset Tag <span className="text-red-500">*</span>
                                </label>
                                <Input placeholder="e.g., AST-001" required />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white" required>
                                    <option value="">Select category</option>
                                    <option value="vehicles">Vehicles</option>
                                    <option value="it_equipment">IT Equipment</option>
                                    <option value="equipment">Equipment</option>
                                    <option value="furniture">Furniture</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Serial Number
                                </label>
                                <Input placeholder="Manufacturer serial number" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Description
                            </label>
                            <Textarea placeholder="Detailed description of the asset..." rows={3} />
                        </div>
                    </CardContent>
                </Card>

                {/* Acquisition Details */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Acquisition Details</CardTitle>
                        <CardDescription>Purchase and valuation information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Purchase Date
                                </label>
                                <Input type="date" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Purchase Price (USD)
                                </label>
                                <Input type="number" placeholder="0.00" min="0" step="0.01" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Current Value (USD)
                                </label>
                                <Input type="number" placeholder="0.00" min="0" step="0.01" />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Vendor/Supplier
                                </label>
                                <Input placeholder="Where was this purchased?" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Warranty Expiry
                                </label>
                                <Input type="date" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Assignment */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Location & Assignment</CardTitle>
                        <CardDescription>Where is the asset and who is responsible?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Location <span className="text-red-500">*</span>
                                </label>
                                <select className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white" required>
                                    <option value="">Select location</option>
                                    <option value="juba">Juba Office</option>
                                    <option value="wau">Wau Office</option>
                                    <option value="malakal">Malakal Office</option>
                                    <option value="bentiu">Bentiu Office</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Assigned To
                                </label>
                                <Input placeholder="Person or department" />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Condition
                                </label>
                                <select className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                                    <option value="good">Good</option>
                                    <option value="fair">Fair</option>
                                    <option value="poor">Poor</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Status
                                </label>
                                <select className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                                    <option value="available">Available</option>
                                    <option value="in_use">In Use</option>
                                    <option value="maintenance">Under Maintenance</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <Link href={`/app/${orgSlug}/assets`}>
                        <Button variant="outline" type="button">Cancel</Button>
                    </Link>
                    <Button type="submit" loading={isSubmitting}>
                        <Save className="w-4 h-4 mr-2" />
                        Register Asset
                    </Button>
                </div>
            </form>
        </div>
    );
}
