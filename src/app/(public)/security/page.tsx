import Link from 'next/link';
import {
    Shield,
    Lock,
    Eye,
    Database,
    Server,
    CheckCircle,
    AlertTriangle,
    Key,
    FileText,
    Globe,
    RefreshCw,
    ArrowRight,
    BadgeCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const securityFeatures = [
    {
        icon: Database,
        title: 'Row-Level Security',
        description: 'Every query is automatically filtered at the database level. Organizations can never accidentally access each other\'s data, even at the API layer.',
    },
    {
        icon: Lock,
        title: 'End-to-End Encryption',
        description: 'All data encrypted at rest (AES-256) and in transit (TLS 1.3). Encryption keys are unique per organization.',
    },
    {
        icon: Key,
        title: 'Multi-Factor Authentication',
        description: 'Required MFA for all users with support for authenticator apps, SMS, and hardware security keys.',
    },
    {
        icon: Eye,
        title: 'Audit Logging',
        description: 'Complete audit trail of all data access and modifications. Immutable logs with tamper detection.',
    },
    {
        icon: Shield,
        title: 'Protection Case Security',
        description: 'Enhanced security for GBV and child protection cases with break-glass access and supervisor approval workflows.',
    },
    {
        icon: RefreshCw,
        title: 'Automatic Backups',
        description: 'Continuous backups with point-in-time recovery. Geo-redundant storage across multiple regions.',
    },
];

const certifications = [
    {
        name: 'SOC 2 Type II',
        description: 'Annual audit of security controls',
        status: 'certified',
    },
    {
        name: 'ISO 27001',
        description: 'Information security management',
        status: 'certified',
    },
    {
        name: 'GDPR Compliant',
        description: 'European data protection',
        status: 'compliant',
    },
    {
        name: 'Core Humanitarian Standard',
        description: 'Humanitarian quality standards',
        status: 'aligned',
    },
];

const protectionMeasures = [
    {
        title: 'Access Controls',
        items: [
            'Role-based permissions with 11 predefined roles',
            'Customizable permission sets per organization',
            'Time-limited access grants for sensitive cases',
            'IP allowlisting for additional security',
        ],
    },
    {
        title: 'Data Protection',
        items: [
            'Data residency options (EU, US, Africa)',
            'Right to deletion and data portability',
            'Anonymization tools for reporting',
            'Automatic data retention policies',
        ],
    },
    {
        title: 'Incident Response',
        items: [
            '24/7 security monitoring',
            'Automated threat detection',
            '1-hour response time for critical incidents',
            'Regular security drills and updates',
        ],
    },
];

export default function SecurityPage() {
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
                            <Link href="/features" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                                Features
                            </Link>
                            <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                                Pricing
                            </Link>
                            <Link href="/security" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 transition-colors">
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
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-800">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/30 text-emerald-400 text-sm font-medium mb-6">
                        <Shield className="w-4 h-4" />
                        Enterprise-Grade Security
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                        Your Data Security is{' '}
                        <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            Our Priority
                        </span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10">
                        Jambi Core is built with security at its core. From row-level data isolation to break-glass access controls, we protect your most sensitive humanitarian data.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/contact">
                            <Button size="lg" className="text-base px-8 bg-emerald-600 hover:bg-emerald-700">
                                Talk to Security Team
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <a href="#certifications">
                            <Button size="lg" className="text-base px-8 bg-white/20 border-2 border-white text-white hover:bg-white hover:text-slate-900 backdrop-blur-sm">
                                View Certifications
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* Security Features */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Security Features
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Multiple layers of security protect your data at every level
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {securityFeatures.map((feature) => (
                            <Card key={feature.title} hover>
                                <CardContent className="p-8">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
                                        <feature.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
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

            {/* Protection Case Security */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium mb-6">
                                <AlertTriangle className="w-4 h-4" />
                                Sensitive Data Protection
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                                Special Handling for Protection Cases
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                                GBV and child protection cases require extra security. Jambi Core provides multiple layers of protection specifically designed for sensitive humanitarian data.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    'Restricted access to authorized protection staff only',
                                    'Break-glass procedure with supervisor approval',
                                    'Automatic access expiration after 24-72 hours',
                                    'Complete audit trail of all access attempts',
                                    'Online-only access (no offline caching)',
                                    'Redacted views for unauthorized users',
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                                        <span className="text-slate-700 dark:text-slate-300">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-8">
                            <div className="space-y-4 font-mono text-sm">
                                <div className="text-slate-400">-- Protection case access check</div>
                                <div className="text-emerald-400">SELECT * FROM cases</div>
                                <div className="text-slate-400">WHERE type IN (&apos;gbv&apos;, &apos;child_protection&apos;)</div>
                                <div className="text-slate-400">AND (</div>
                                <div className="text-purple-400 ml-4">-- User has protection role</div>
                                <div className="text-slate-400 ml-4">has_role(&apos;protection_officer&apos;)</div>
                                <div className="text-slate-400 ml-4">OR</div>
                                <div className="text-purple-400 ml-4">-- User has break-glass access</div>
                                <div className="text-slate-400 ml-4">has_active_break_glass(user_id, case_id)</div>
                                <div className="text-slate-400">);</div>
                                <div className="border-t border-slate-700 mt-6 pt-6">
                                    <div className="text-amber-400">⚠ All access logged to audit_logs</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Certifications */}
            <section id="certifications" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Compliance & Certifications
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            We maintain industry-standard certifications and compliance
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {certifications.map((cert) => (
                            <Card key={cert.name}>
                                <CardContent className="p-6 text-center">
                                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <BadgeCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                                        {cert.name}
                                    </h3>
                                    <p className="text-sm text-slate-500 mb-3">
                                        {cert.description}
                                    </p>
                                    <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full capitalize">
                                        {cert.status}
                                    </span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Protection Measures */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Protection Measures
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Comprehensive protection across all aspects of the platform
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {protectionMeasures.map((measure) => (
                            <Card key={measure.title}>
                                <CardContent className="p-8">
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                                        {measure.title}
                                    </h3>
                                    <ul className="space-y-3">
                                        {measure.items.map((item) => (
                                            <li key={item} className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                                                <span className="text-slate-600 dark:text-slate-400 text-sm">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Security Report CTA */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-teal-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Request Our Security Documentation
                    </h2>
                    <p className="text-xl text-emerald-100 mb-10">
                        Get access to our detailed security whitepaper, penetration test reports, and compliance documentation.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/contact">
                            <Button size="lg" variant="secondary" className="text-base px-8">
                                <FileText className="w-5 h-5 mr-2" />
                                Request Security Pack
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" className="text-base px-8 bg-white/20 border-2 border-white text-white hover:bg-white hover:text-emerald-600 backdrop-blur-sm">
                                Talk to Security Team
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
