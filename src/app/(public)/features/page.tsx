import Link from 'next/link';
import {
    Users,
    Building2,
    Shield,
    BarChart3,
    WifiOff,
    Globe,
    FileText,
    DollarSign,
    Package,
    ClipboardList,
    Settings,
    Lock,
    RefreshCw,
    CheckCircle,
    ArrowRight,
    Smartphone,
    Database,
    Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const featureCategories = [
    {
        title: 'Program Management',
        description: 'Complete tools for managing your humanitarian programs',
        icon: ClipboardList,
        color: 'indigo',
        features: [
            {
                icon: Users,
                title: 'Beneficiary Management',
                description: 'Track individuals and households with flexible identifiers. Support for multiple enrollment types and demographics tracking.',
            },
            {
                icon: Building2,
                title: 'Multi-Branch Structure',
                description: 'Manage HQ, regional branches, and field offices with hierarchical reporting and access control.',
            },
            {
                icon: FileText,
                title: 'Project Tracking',
                description: 'Monitor project activities, indicators, and milestones. Connect beneficiaries to specific programs.',
            },
            {
                icon: Package,
                title: 'Distribution Management',
                description: 'Plan and track item, cash, and voucher distributions. Offline recording and verification.',
            },
        ],
    },
    {
        title: 'Protection & Security',
        description: 'Enterprise-grade security for sensitive humanitarian data',
        icon: Shield,
        color: 'red',
        features: [
            {
                icon: Lock,
                title: 'GBV Case Management',
                description: 'Secure handling of Gender-Based Violence cases with strict access controls and audit trails.',
            },
            {
                icon: Shield,
                title: 'Child Protection',
                description: 'Specialized workflows for child protection cases with age-appropriate consent and break-glass access.',
            },
            {
                icon: Database,
                title: 'Row-Level Security',
                description: 'Data isolation at the database level. Each organization sees only their data.',
            },
            {
                icon: Settings,
                title: 'Role-Based Access',
                description: '11 predefined roles with customizable permissions. Granular control over who sees what.',
            },
        ],
    },
    {
        title: 'Finance & Operations',
        description: 'Complete financial management for humanitarian organizations',
        icon: DollarSign,
        color: 'emerald',
        features: [
            {
                icon: BarChart3,
                title: 'Budget Management',
                description: 'Multi-currency budgeting with USD and local currency support. Track actuals vs. planned.',
            },
            {
                icon: FileText,
                title: 'Expense Tracking',
                description: 'Submit, approve, and track expenses with multi-level approval workflows.',
            },
            {
                icon: Package,
                title: 'Procurement',
                description: 'Manage purchase requests, vendor quotations, and purchase orders with approval routing.',
            },
            {
                icon: ClipboardList,
                title: 'Asset Management',
                description: 'Track fixed assets and inventory across locations. Depreciation and maintenance schedules.',
            },
        ],
    },
    {
        title: 'Field Operations',
        description: 'Built for the realities of humanitarian work in challenging environments',
        icon: Globe,
        color: 'purple',
        features: [
            {
                icon: WifiOff,
                title: 'Offline-First Design',
                description: 'Full functionality without internet. Automatic sync when connectivity returns.',
            },
            {
                icon: Smartphone,
                title: 'Mobile Responsive',
                description: 'Works on any device. Optimized for tablets and smartphones in the field.',
            },
            {
                icon: RefreshCw,
                title: 'Conflict Resolution',
                description: 'Smart sync handles conflicts when multiple users work offline simultaneously.',
            },
            {
                icon: Zap,
                title: 'Fast Performance',
                description: 'Optimized for low-bandwidth environments. Progressive loading and data caching.',
            },
        ],
    },
];

const integrations = [
    { name: 'DHIS2', description: 'Health information system' },
    { name: 'Kobo Toolbox', description: 'Data collection' },
    { name: 'ODK', description: 'Mobile data collection' },
    { name: 'Power BI', description: 'Advanced analytics' },
    { name: 'IATI', description: 'Aid transparency' },
    { name: 'Custom APIs', description: 'Build your own' },
];

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">JC</span>
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white">Jambi Core</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/features" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 transition-colors">
                                Features
                            </Link>
                            <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                                Pricing
                            </Link>
                            <Link href="/security" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                                Security
                            </Link>
                            <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                                About
                            </Link>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href="/login">
                                <Button variant="ghost" size="sm">Log in</Button>
                            </Link>
                            <Link href="/signup">
                                <Button size="sm">Get Started</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                        Everything Your NGO Needs,{' '}
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            In One Platform
                        </span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10">
                        Jambi Core combines program management, protection case handling, financial tracking, and field operations into a single, secure platform built for humanitarian organizations.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/signup">
                            <Button size="lg" className="text-base px-8">
                                Start Free Trial
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button variant="outline" size="lg" className="text-base px-8 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300">
                                Request Demo
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Feature Categories */}
            {featureCategories.map((category, categoryIndex) => (
                <section
                    key={category.title}
                    className={`py-24 px-4 sm:px-6 lg:px-8 ${categoryIndex % 2 === 0 ? 'bg-white dark:bg-slate-950' : 'bg-slate-50 dark:bg-slate-900'}`}
                >
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-${category.color}-100 dark:bg-${category.color}-900/30 mb-6`}>
                                <category.icon className={`w-8 h-8 text-${category.color}-600 dark:text-${category.color}-400`} />
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                                {category.title}
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                {category.description}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {category.features.map((feature) => (
                                <Card key={feature.title} hover>
                                    <CardContent className="p-8">
                                        <div className={`w-12 h-12 rounded-xl bg-${category.color}-100 dark:bg-${category.color}-900/30 flex items-center justify-center mb-6`}>
                                            <feature.icon className={`w-6 h-6 text-${category.color}-600 dark:text-${category.color}-400`} />
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                                            {feature.title}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            {feature.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            ))}

            {/* Integrations */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Integrations
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Connect Jambi Core with the tools you already use
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {integrations.map((integration) => (
                            <Card key={integration.name}>
                                <CardContent className="p-6 text-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <span className="text-white font-bold text-lg">{integration.name.charAt(0)}</span>
                                    </div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                                        {integration.name}
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        {integration.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Ready to See It in Action?
                    </h2>
                    <p className="text-xl text-indigo-100 mb-10">
                        Start your free trial today or request a personalized demo from our team.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/signup">
                            <Button size="lg" variant="secondary" className="text-base px-8">
                                Start Free Trial
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" className="text-base px-8 bg-white/20 border-2 border-white text-white hover:bg-white hover:text-indigo-600 backdrop-blur-sm">
                                Request Demo
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-slate-400">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">JC</span>
                        </div>
                        <span className="text-lg font-bold text-white">Jambi Core</span>
                    </div>
                    <p className="text-sm mb-6">
                        Production-ready NGO management for the modern humanitarian sector.
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/security" className="hover:text-white transition-colors">Security</Link>
                    </div>
                    <div className="border-t border-slate-800 mt-8 pt-8 text-sm">
                        <p>&copy; {new Date().getFullYear()} Jambi Core. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
