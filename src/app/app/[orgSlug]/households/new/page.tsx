'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Save,
    Home,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface PageProps {
    params: Promise<{ orgSlug: string }>;
}

export default function NewHouseholdPage({ params }: PageProps) {
    const { orgSlug } = use(params);
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSubmitting(false);
        router.push(`/app/${orgSlug}/households`);
    };

    return (
        <div className="page-container max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href={`/app/${orgSlug}/households`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="section-title">Add New Household</h1>
                    <p className="section-description">Register a new household group</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Head of Household */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Home className="w-5 h-5 text-indigo-600" />
                            Head of Household
                        </CardTitle>
                        <CardDescription>Primary contact for this household</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <Input placeholder="Head of household name" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Gender <span className="text-red-500">*</span>
                                </label>
                                <select className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white" required>
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Phone Number
                                </label>
                                <Input type="tel" placeholder="+211 9XX XXX XXX" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    ID Number
                                </label>
                                <Input placeholder="National ID or UNHCR number" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Household Composition */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-purple-600" />
                            Household Composition
                        </CardTitle>
                        <CardDescription>Number of members by category</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Total Members <span className="text-red-500">*</span>
                                </label>
                                <Input type="number" min="1" placeholder="0" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Adults (18+)
                                </label>
                                <Input type="number" min="0" placeholder="0" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Children (5-17)
                                </label>
                                <Input type="number" min="0" placeholder="0" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Under 5
                                </label>
                                <Input type="number" min="0" placeholder="0" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Location */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Location</CardTitle>
                        <CardDescription>Where does this household reside?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    State <span className="text-red-500">*</span>
                                </label>
                                <select className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white" required>
                                    <option value="">Select state</option>
                                    <option value="central_equatoria">Central Equatoria</option>
                                    <option value="western_bahr_el_ghazal">Western Bahr el Ghazal</option>
                                    <option value="upper_nile">Upper Nile</option>
                                    <option value="unity">Unity</option>
                                    <option value="jonglei">Jonglei</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    County <span className="text-red-500">*</span>
                                </label>
                                <Input placeholder="County name" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Payam
                                </label>
                                <Input placeholder="Payam name" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Specific Location
                            </label>
                            <Input placeholder="e.g., Juba POC, Block 4" />
                        </div>
                    </CardContent>
                </Card>

                {/* Vulnerabilities */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Vulnerabilities</CardTitle>
                        <CardDescription>Select all that apply</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                            {[
                                'Female-headed',
                                'Child-headed',
                                'Elderly member',
                                'Disabled member',
                                'Chronic illness',
                                'Pregnant/Lactating',
                                'Unaccompanied minors',
                                'Single parent',
                                'Recently displaced',
                            ].map((vulnerability) => (
                                <label key={vulnerability} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">{vulnerability}</span>
                                </label>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Notes */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Additional Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea placeholder="Any additional information about this household..." rows={4} />
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <Link href={`/app/${orgSlug}/households`}>
                        <Button variant="outline" type="button">Cancel</Button>
                    </Link>
                    <Button type="submit" loading={isSubmitting}>
                        <Save className="w-4 h-4 mr-2" />
                        Register Household
                    </Button>
                </div>
            </form>
        </div>
    );
}
