import Link from 'next/link';
import { Check, X, Zap, Building, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
    title: 'Pricing - Jambi Core',
    description: 'Simple, transparent pricing for SaaS and self-hosted deployments.',
};

const saasPlans = [
    {
        name: 'Starter',
        description: 'For small NGOs getting started',
        price: 99,
        period: 'month',
        features: [
            { text: 'Up to 3 branches', included: true },
            { text: 'Up to 10 users', included: true },
            { text: 'Up to 1,000 beneficiaries', included: true },
            { text: 'Basic reporting', included: true },
            { text: 'Email support', included: true },
            { text: 'Protection cases', included: false },
            { text: 'Custom workflows', included: false },
            { text: 'API access', included: false },
        ],
        cta: 'Start Free Trial',
        highlighted: false,
    },
    {
        name: 'Growth',
        description: 'For growing organizations',
        price: 299,
        period: 'month',
        features: [
            { text: 'Up to 10 branches', included: true },
            { text: 'Up to 50 users', included: true },
            { text: 'Up to 10,000 beneficiaries', included: true },
            { text: 'Advanced reporting', included: true },
            { text: 'Priority support', included: true },
            { text: 'Protection cases', included: true },
            { text: 'Custom workflows', included: true },
            { text: 'API access', included: false },
        ],
        cta: 'Start Free Trial',
        highlighted: true,
    },
    {
        name: 'Enterprise',
        description: 'For large operations',
        price: 799,
        period: 'month',
        features: [
            { text: 'Unlimited branches', included: true },
            { text: 'Unlimited users', included: true },
            { text: 'Unlimited beneficiaries', included: true },
            { text: 'Custom reporting', included: true },
            { text: 'Dedicated support', included: true },
            { text: 'Protection cases', included: true },
            { text: 'Custom workflows', included: true },
            { text: 'Full API access', included: true },
        ],
        cta: 'Contact Sales',
        highlighted: false,
    },
];

const selfHostedOptions = [
    {
        name: 'Single Organization',
        description: 'Perfect for one NGO',
        price: 2499,
        period: 'one-time',
        features: [
            'Full source code access',
            'Single organization setup',
            'Up to 5 branches',
            'Email setup guide',
            '90 days email support',
            '1 year updates',
        ],
    },
    {
        name: 'Multi-Branch',
        description: 'For complex operations',
        price: 4999,
        period: 'one-time',
        features: [
            'Full source code access',
            'Unlimited branches',
            'Unlimited users',
            'Deployment assistance',
            '6 months priority support',
            'Lifetime updates',
        ],
    },
    {
        name: 'Enterprise Setup',
        description: 'White-glove deployment',
        price: 9999,
        period: 'one-time',
        features: [
            'Everything in Multi-Branch',
            'Custom branding',
            'On-site deployment help',
            'Staff training (remote)',
            '1 year priority support',
            'Custom integrations',
        ],
    },
];

export default function PricingPage() {
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

            {/* Header */}
            <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400">
                        Choose SaaS for managed hosting or self-hosted for complete control.
                    </p>
                </div>
            </section>

            {/* SaaS Pricing */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-4">
                            <Zap className="w-4 h-4" />
                            Cloud SaaS
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                            SaaS Subscription Plans
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">
                            All plans include 14-day free trial. No credit card required.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {saasPlans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`rounded-2xl p-8 ${plan.highlighted
                                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white ring-4 ring-indigo-300 dark:ring-indigo-700'
                                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                                    }`}
                            >
                                <h3 className={`text-xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                    {plan.name}
                                </h3>
                                <p className={`text-sm mb-6 ${plan.highlighted ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                                    {plan.description}
                                </p>
                                <div className="mb-6">
                                    <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                        ${plan.price}
                                    </span>
                                    <span className={`text-sm ${plan.highlighted ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                                        /{plan.period}
                                    </span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-2 text-sm">
                                            {feature.included ? (
                                                <Check className={`w-5 h-5 ${plan.highlighted ? 'text-indigo-200' : 'text-emerald-500'}`} />
                                            ) : (
                                                <X className={`w-5 h-5 ${plan.highlighted ? 'text-indigo-300' : 'text-slate-300 dark:text-slate-600'}`} />
                                            )}
                                            <span className={feature.included ? '' : plan.highlighted ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'}>
                                                {feature.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <Link href={plan.cta === 'Contact Sales' ? '/contact' : '/signup'}>
                                    <Button
                                        className="w-full"
                                        variant={plan.highlighted ? 'secondary' : 'default'}
                                    >
                                        {plan.cta}
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Self-Hosted Pricing */}
            <section id="self-hosted" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium mb-4">
                            <Server className="w-4 h-4" />
                            Self-Hosted License
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Self-Hosted Options
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-2xl mx-auto">
                            One-time purchase. Full source code. Complete data ownership. Deploy on your infrastructure.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {selfHostedOptions.map((option) => (
                            <div
                                key={option.name}
                                className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700"
                            >
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                    {option.name}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                    {option.description}
                                </p>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-slate-900 dark:text-white">
                                        ${option.price.toLocaleString()}
                                    </span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {' '}one-time
                                    </span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {option.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                            <Check className="w-5 h-5 text-emerald-500" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/contact?type=self-hosted">
                                    <Button variant="outline" className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300">
                                        Buy License
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-8 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                    Need Custom Deployment?
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Talk to us about custom integrations, white-labeling, and enterprise requirements.
                                </p>
                            </div>
                            <Link href="/contact?type=enterprise">
                                <Button size="lg">Contact Sales</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-8">
                        {[
                            {
                                q: 'What\'s included in the self-hosted license?',
                                a: 'Full source code, deployment guides, database migrations, and all features. You own and control everything.',
                            },
                            {
                                q: 'Can I switch from SaaS to self-hosted?',
                                a: 'Yes! We can export your data and help you migrate. Contact support for assistance.',
                            },
                            {
                                q: 'Do you offer discounts for NGOs?',
                                a: 'Yes, registered 501(c)(3) organizations get 30% off SaaS plans and 20% off self-hosted licenses.',
                            },
                            {
                                q: 'What about data security?',
                                a: 'SaaS data is encrypted at rest and in transit. Self-hosted gives you complete control over your data.',
                            },
                        ].map((item, index) => (
                            <div key={index} className="border-b border-slate-200 dark:border-slate-700 pb-6">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                    {item.q}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    {item.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-slate-400">
                <div className="max-w-7xl mx-auto text-center">
                    <p>&copy; {new Date().getFullYear()} Jambi Core. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
