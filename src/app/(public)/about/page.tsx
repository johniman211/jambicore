import Link from 'next/link';
import {
    Heart,
    Globe,
    Users,
    Target,
    Award,
    Lightbulb,
    ArrowRight,
    MapPin,
    Calendar,
    Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const values = [
    {
        icon: Heart,
        title: 'Humanitarian First',
        description: 'Every feature we build serves the mission of helping those in need. We never lose sight of why we exist.',
    },
    {
        icon: Globe,
        title: 'Field-Tested',
        description: 'Built in partnership with organizations working in challenging environments. We understand the realities of humanitarian work.',
    },
    {
        icon: Users,
        title: 'Community Driven',
        description: 'Open source at heart. We believe in collaboration and shared learning across the humanitarian sector.',
    },
    {
        icon: Target,
        title: 'Impact Focused',
        description: 'We measure success by the number of people helped, not just software metrics.',
    },
];

const milestones = [
    {
        year: '2020',
        title: 'Project Started',
        description: 'Initial concept developed in response to gaps in existing NGO management tools.',
    },
    {
        year: '2021',
        title: 'First Field Deployment',
        description: 'Piloted with 3 NGOs in South Sudan, gathering real-world feedback.',
    },
    {
        year: '2022',
        title: 'Multi-Tenant Launch',
        description: 'Launched SaaS platform with support for multiple organizations.',
    },
    {
        year: '2023',
        title: 'Protection Module',
        description: 'Added specialized GBV and child protection case management.',
    },
    {
        year: '2024',
        title: 'Global Expansion',
        description: 'Now serving 100+ organizations across 30+ countries.',
    },
];

const team = [
    {
        name: 'Sarah Akello',
        role: 'CEO & Co-Founder',
        bio: 'Former UNHCR field coordinator with 15 years in humanitarian operations.',
        location: 'Juba, South Sudan',
    },
    {
        name: 'Michael Chen',
        role: 'CTO & Co-Founder',
        bio: 'Previously led engineering at a major humanitarian tech organization.',
        location: 'Nairobi, Kenya',
    },
    {
        name: 'Emma Okonkwo',
        role: 'Head of Product',
        bio: 'Background in both NGO program management and software development.',
        location: 'Geneva, Switzerland',
    },
    {
        name: 'David Lado',
        role: 'Head of Customer Success',
        bio: 'Former M&E specialist with experience across multiple humanitarian crises.',
        location: 'Kampala, Uganda',
    },
];

const partners = [
    'UNHCR', 'UNICEF', 'WFP', 'ICRC', 'MSF', 'IRC', 'Save the Children', 'CARE International'
];

export default function AboutPage() {
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
                            <Link href="/security" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                                Security
                            </Link>
                            <Link href="/about" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 transition-colors">
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
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50 to-white dark:from-slate-900 dark:to-slate-950">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
                        <Lightbulb className="w-4 h-4" />
                        Our Story
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                        Built by Humanitarians,{' '}
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            For Humanitarians
                        </span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                        Jambi Core was born from the frustration of using tools that weren&apos;t designed for the realities of humanitarian work. We set out to build something better.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                                Our Mission
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                                We believe that NGOs shouldn&apos;t have to choose between powerful software and tools designed for their unique needs. Jambi Core bridges this gap by providing enterprise-grade capabilities with humanitarian-first design.
                            </p>
                            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                                From beneficiary tracking to protection case management, from offline-first functionality to multi-currency finance—every feature is built with the understanding that humanitarian work happens in challenging environments with vulnerable populations.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <p className="text-4xl font-bold text-indigo-600">100+</p>
                                    <p className="text-sm text-slate-500">Organizations</p>
                                </div>
                                <div className="w-px h-12 bg-slate-200 dark:bg-slate-700" />
                                <div className="text-center">
                                    <p className="text-4xl font-bold text-indigo-600">500K+</p>
                                    <p className="text-sm text-slate-500">Beneficiaries Served</p>
                                </div>
                                <div className="w-px h-12 bg-slate-200 dark:bg-slate-700" />
                                <div className="text-center">
                                    <p className="text-4xl font-bold text-indigo-600">30+</p>
                                    <p className="text-sm text-slate-500">Countries</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-1">
                            <div className="bg-white dark:bg-slate-900 rounded-xl p-8">
                                <blockquote className="text-xl italic text-slate-600 dark:text-slate-400 mb-6">
                                    &ldquo;Jambi Core has transformed how we manage our programs. For the first time, we have a system that actually understands the complexity of humanitarian operations.&rdquo;
                                </blockquote>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                                        <span className="text-indigo-600 font-bold">MK</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">Mary Kiden</p>
                                        <p className="text-sm text-slate-500">Program Director, International NGO</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Our Values
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value) => (
                            <Card key={value.title}>
                                <CardContent className="p-8 text-center">
                                    <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mx-auto mb-6">
                                        <value.icon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                                        {value.title}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        {value.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Our Journey
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            From concept to global platform
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <div className="relative">
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-indigo-200 dark:bg-indigo-800" />
                            <div className="space-y-12">
                                {milestones.map((milestone, index) => (
                                    <div key={milestone.year} className="relative flex gap-8">
                                        <div className="shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center z-10">
                                            <Calendar className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="pb-8">
                                            <span className="text-indigo-600 font-bold">{milestone.year}</span>
                                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-1 mb-2">
                                                {milestone.title}
                                            </h3>
                                            <p className="text-slate-600 dark:text-slate-400">
                                                {milestone.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Leadership Team
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Experienced professionals with deep humanitarian sector expertise
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member) => (
                            <Card key={member.name}>
                                <CardContent className="p-6">
                                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl font-bold text-white">
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-semibold text-slate-900 dark:text-white">
                                            {member.name}
                                        </h3>
                                        <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-3">
                                            {member.role}
                                        </p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                            {member.bio}
                                        </p>
                                        <div className="flex items-center justify-center gap-1 text-xs text-slate-400">
                                            <MapPin className="w-3 h-3" />
                                            {member.location}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partners */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Trusted By Leading Organizations
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12">
                        We&apos;re proud to work with organizations making a difference worldwide
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8">
                        {partners.map((partner) => (
                            <div
                                key={partner}
                                className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 font-medium"
                            >
                                {partner}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Join Our Mission
                    </h2>
                    <p className="text-xl text-indigo-100 mb-10">
                        Whether you&apos;re an NGO looking for better tools or a developer who wants to contribute, we&apos;d love to hear from you.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/signup">
                            <Button size="lg" variant="secondary" className="text-base px-8">
                                Start Free Trial
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" className="text-base px-8 bg-white/20 border-2 border-white text-white hover:bg-white hover:text-indigo-600 backdrop-blur-sm">
                                Get in Touch
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
