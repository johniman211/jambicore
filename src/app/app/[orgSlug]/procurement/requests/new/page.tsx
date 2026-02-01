'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Save,
    ClipboardList,
    Plus,
    Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface PageProps {
    params: Promise<{ orgSlug: string }>;
}

interface LineItem {
    id: string;
    description: string;
    quantity: number;
    unit: string;
    estimatedPrice: number;
}

export default function NewProcurementRequestPage({ params }: PageProps) {
    const { orgSlug } = use(params);
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lineItems, setLineItems] = useState<LineItem[]>([
        { id: '1', description: '', quantity: 1, unit: 'pcs', estimatedPrice: 0 },
    ]);

    const addLineItem = () => {
        setLineItems([
            ...lineItems,
            { id: Date.now().toString(), description: '', quantity: 1, unit: 'pcs', estimatedPrice: 0 },
        ]);
    };

    const removeLineItem = (id: string) => {
        if (lineItems.length > 1) {
            setLineItems(lineItems.filter((item) => item.id !== id));
        }
    };

    const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
        setLineItems(
            lineItems.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const totalAmount = lineItems.reduce((sum, item) => sum + item.quantity * item.estimatedPrice, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSubmitting(false);
        router.push(`/app/${orgSlug}/procurement/requests`);
    };

    return (
        <div className="page-container max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href={`/app/${orgSlug}/procurement/requests`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="section-title">New Procurement Request</h1>
                    <p className="section-description">Submit a request for goods or services</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Request Details */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-indigo-600" />
                            Request Details
                        </CardTitle>
                        <CardDescription>Basic information about your request</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Request Title <span className="text-red-500">*</span>
                                </label>
                                <Input placeholder="e.g., Office Supplies Q1" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white" required>
                                    <option value="">Select category</option>
                                    <option value="office_supplies">Office Supplies</option>
                                    <option value="it_equipment">IT Equipment</option>
                                    <option value="vehicle">Vehicle</option>
                                    <option value="nfi">NFI / Relief Items</option>
                                    <option value="services">Services</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Project / Budget Line <span className="text-red-500">*</span>
                                </label>
                                <select className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white" required>
                                    <option value="">Select project</option>
                                    <option value="operations">Operations</option>
                                    <option value="fsl-2024-001">FSL-2024-001</option>
                                    <option value="wash-2024-002">WASH-2024-002</option>
                                    <option value="prot-2024-003">PROT-2024-003</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Required By
                                </label>
                                <Input type="date" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Justification <span className="text-red-500">*</span>
                            </label>
                            <Textarea placeholder="Why is this procurement needed?" rows={3} required />
                        </div>
                    </CardContent>
                </Card>

                {/* Line Items */}
                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Items / Services</CardTitle>
                                <CardDescription>List the items or services you need</CardDescription>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Item
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {lineItems.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-12 gap-4 items-end">
                                    <div className="col-span-5">
                                        {index === 0 && (
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Description
                                            </label>
                                        )}
                                        <Input
                                            placeholder="Item description"
                                            value={item.description}
                                            onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        {index === 0 && (
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Qty
                                            </label>
                                        )}
                                        <Input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        {index === 0 && (
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Unit
                                            </label>
                                        )}
                                        <select
                                            className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                            value={item.unit}
                                            onChange={(e) => updateLineItem(item.id, 'unit', e.target.value)}
                                        >
                                            <option value="pcs">pcs</option>
                                            <option value="kg">kg</option>
                                            <option value="lot">lot</option>
                                            <option value="set">set</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        {index === 0 && (
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Est. Price
                                            </label>
                                        )}
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={item.estimatedPrice || ''}
                                            onChange={(e) => updateLineItem(item.id, 'estimatedPrice', parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        {index === 0 && (
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 opacity-0">
                                                Del
                                            </label>
                                        )}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeLineItem(item.id)}
                                            disabled={lineItems.length === 1}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                            <div className="text-right">
                                <p className="text-sm text-slate-500">Estimated Total</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Attachments */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Attachments</CardTitle>
                        <CardDescription>Upload supporting documents (quotes, specifications, etc.)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-8 text-center">
                            <p className="text-sm text-slate-500">Drag and drop files here, or click to browse</p>
                            <Button type="button" variant="outline" size="sm" className="mt-4">
                                Choose Files
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-between">
                    <Button type="button" variant="outline">
                        Save as Draft
                    </Button>
                    <div className="flex items-center gap-3">
                        <Link href={`/app/${orgSlug}/procurement/requests`}>
                            <Button variant="outline" type="button">Cancel</Button>
                        </Link>
                        <Button type="submit" loading={isSubmitting}>
                            <Save className="w-4 h-4 mr-2" />
                            Submit for Approval
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
