'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    FolderKanban,
    ArrowLeft,
    Loader2,
    Calendar,
    DollarSign,
    MapPin,
    Users,
    Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { use } from 'react';

const donors = [
    'USAID', 'UNICEF', 'ECHO', 'DFID', 'SIDA', 'NORAD', 'GAC', 'JICA', 'GIZ', 'Other'
];

const sectors = [
    { value: 'food_security', label: 'Food Security & Livelihoods' },
    { value: 'wash', label: 'WASH' },
    { value: 'protection', label: 'Protection' },
    { value: 'education', label: 'Education' },
    { value: 'health', label: 'Health' },
    { value: 'shelter', label: 'Shelter & NFI' },
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'multi_sector', label: 'Multi-Sector' },
];

interface PageProps {
    params: Promise<{ orgSlug: string }>;
}

export default function NewProjectPage({ params }: PageProps) {
    const { orgSlug } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        donor: '',
        sector: '',
        description: '',
        startDate: '',
        endDate: '',
        budget: '',
        branch: '',
        targetBeneficiaries: '',
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

        // Simulate saving - in production this would save to database
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Redirect back to projects list
        router.push(`/app/${orgSlug}/projects`);
    };

    return (
        <div className="page-container">
            <Link href={`/app/${orgSlug}/projects`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
                <ArrowLeft className="w-4 h-4" />
                Back to Projects
            </Link>

            <div className="max-w-3xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <FolderKanban className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Create New Project
                        </h1>
                        <p className="text-slate-500">
                            Set up a new project for your organization
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Project Code <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        placeholder="e.g., FSL-2024-001"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Donor <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="donor"
                                        value={formData.donor}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                        required
                                    >
                                        <option value="">Select donor...</option>
                                        {donors.map(donor => (
                                            <option key={donor} value={donor}>{donor}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Project Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g., Food Security & Livelihoods Program"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Sector <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="sector"
                                    value={formData.sector}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    required
                                >
                                    <option value="">Select sector...</option>
                                    {sectors.map(sector => (
                                        <option key={sector.value} value={sector.value}>{sector.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Description
                                </label>
                                <Textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Brief description of the project objectives..."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Project Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        <Calendar className="w-4 h-4 inline mr-1" />
                                        Start Date <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        <Calendar className="w-4 h-4 inline mr-1" />
                                        End Date <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        <DollarSign className="w-4 h-4 inline mr-1" />
                                        Budget (USD) <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="number"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        placeholder="e.g., 500000"
                                        required
                                    />
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
                                        placeholder="e.g., 5000"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <MapPin className="w-4 h-4 inline mr-1" />
                                    Implementing Branch
                                </label>
                                <Input
                                    name="branch"
                                    value={formData.branch}
                                    onChange={handleChange}
                                    placeholder="e.g., Juba HQ"
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
                                    Create Project
                                </>
                            )}
                        </Button>
                        <Link href={`/app/${orgSlug}/projects`}>
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
