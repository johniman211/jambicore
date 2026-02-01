'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Mail,
    Phone,
    MapPin,
    Send,
    MessageSquare,
    Building2,
    Clock,
    CheckCircle,
    ArrowRight,
    Globe,
    HeadphonesIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

const offices = [
    {
        city: 'Juba',
        country: 'South Sudan',
        address: 'Plot 123, Kololo Road',
        phone: '+211 912 345 678',
        email: 'juba@jambicore.org',
        hours: 'Mon-Fri: 8:00 AM - 5:00 PM',
        isPrimary: true,
    },
    {
        city: 'Nairobi',
        country: 'Kenya',
        address: 'Westlands Business Park, Tower B',
        phone: '+254 700 123 456',
        email: 'nairobi@jambicore.org',
        hours: 'Mon-Fri: 8:00 AM - 5:00 PM',
        isPrimary: false,
    },
    {
        city: 'Geneva',
        country: 'Switzerland',
        address: 'Rue de Lausanne 42',
        phone: '+41 22 123 45 67',
        email: 'geneva@jambicore.org',
        hours: 'Mon-Fri: 9:00 AM - 6:00 PM',
        isPrimary: false,
    },
];

const inquiryTypes = [
    { value: 'demo', label: 'Request a Demo' },
    { value: 'sales', label: 'Sales Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'partnership', label: 'Partnership Opportunity' },
    { value: 'general', label: 'General Question' },
];

export default function ContactPage() {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        organization: '',
        inquiryType: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        // Validate form
        if (!formState.name || !formState.email || !formState.message) {
            setError('Please fill in all required fields.');
            setIsSubmitting(false);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formState.email)) {
            setError('Please enter a valid email address.');
            setIsSubmitting(false);
            return;
        }

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSubmitted(true);
        setIsSubmitting(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormState((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

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
            <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
                        <MessageSquare className="w-4 h-4" />
                        We&apos;d love to hear from you
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                        Get in Touch
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Have questions about Jambi Core? Want to schedule a demo? Our team is here to help you transform your NGO operations.
                    </p>
                </div>
            </section>

            {/* Contact Form and Info */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-5 gap-12">
                        {/* Contact Form */}
                        <div className="lg:col-span-3">
                            <Card className="overflow-hidden">
                                <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
                                <CardContent className="p-8">
                                    {isSubmitted ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                                Message Sent!
                                            </h3>
                                            <p className="text-slate-600 dark:text-slate-400 mb-8">
                                                Thank you for reaching out. Our team will get back to you within 24 hours.
                                            </p>
                                            <Button onClick={() => setIsSubmitted(false)}>
                                                Send Another Message
                                            </Button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        Your Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <Input
                                                        name="name"
                                                        value={formState.name}
                                                        onChange={handleChange}
                                                        placeholder="John Doe"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        Email Address <span className="text-red-500">*</span>
                                                    </label>
                                                    <Input
                                                        name="email"
                                                        type="email"
                                                        value={formState.email}
                                                        onChange={handleChange}
                                                        placeholder="john@organization.org"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        Organization
                                                    </label>
                                                    <Input
                                                        name="organization"
                                                        value={formState.organization}
                                                        onChange={handleChange}
                                                        placeholder="Your NGO name"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        Inquiry Type
                                                    </label>
                                                    <select
                                                        name="inquiryType"
                                                        value={formState.inquiryType}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                    >
                                                        <option value="">Select an option</option>
                                                        {inquiryTypes.map((type) => (
                                                            <option key={type.value} value={type.value}>
                                                                {type.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                    Message <span className="text-red-500">*</span>
                                                </label>
                                                <Textarea
                                                    name="message"
                                                    value={formState.message}
                                                    onChange={handleChange}
                                                    placeholder="Tell us how we can help..."
                                                    rows={6}
                                                    required
                                                />
                                            </div>

                                            {error && (
                                                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                                                    {error}
                                                </div>
                                            )}

                                            <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
                                                <Send className="w-4 h-4 mr-2" />
                                                Send Message
                                            </Button>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Quick Contact */}
                            <Card>
                                <CardContent className="p-6 space-y-6">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Quick Contact
                                    </h3>
                                    <div className="space-y-4">
                                        <a
                                            href="mailto:hello@jambicore.org"
                                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                                <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500">Email</p>
                                                <p className="font-medium text-slate-900 dark:text-white">hello@jambicore.org</p>
                                            </div>
                                        </a>
                                        <a
                                            href="tel:+211912345678"
                                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                                <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500">Phone</p>
                                                <p className="font-medium text-slate-900 dark:text-white">+211 912 345 678</p>
                                            </div>
                                        </a>
                                        <div className="flex items-center gap-4 p-3 rounded-lg">
                                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                                <HeadphonesIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500">Support Hours</p>
                                                <p className="font-medium text-slate-900 dark:text-white">24/7 for Enterprise</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Demo CTA */}
                            <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 border-0">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        Schedule a Live Demo
                                    </h3>
                                    <p className="text-indigo-100 text-sm mb-4">
                                        See Jambi Core in action with a personalized walkthrough from our team.
                                    </p>
                                    <Button variant="secondary" className="w-full">
                                        Book Demo
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Office Locations */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                            Our Offices
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            Supporting humanitarian organizations worldwide
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {offices.map((office) => (
                            <Card key={office.city} className={office.isPrimary ? 'ring-2 ring-indigo-500' : ''}>
                                <CardContent className="p-6">
                                    {office.isPrimary && (
                                        <span className="inline-block px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded mb-4">
                                            Headquarters
                                        </span>
                                    )}
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg shrink-0">
                                            <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                                {office.city}
                                            </h3>
                                            <p className="text-slate-500">{office.country}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                                            <span className="text-slate-600 dark:text-slate-400">{office.address}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                            <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="text-slate-600 dark:text-slate-400 hover:text-indigo-600">
                                                {office.phone}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            <a href={`mailto:${office.email}`} className="text-slate-600 dark:text-slate-400 hover:text-indigo-600">
                                                {office.email}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-4 h-4 text-slate-400" />
                                            <span className="text-slate-600 dark:text-slate-400">{office.hours}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
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
