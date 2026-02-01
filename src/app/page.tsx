import Link from 'next/link';
import {
  ArrowRight,
  Shield,
  Globe,
  Users,
  BarChart3,
  Wifi,
  WifiOff,
  Building2,
  CheckCircle,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
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
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-mesh min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              Production-ready NGO Management Platform
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
              Manage Your NGO with{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Confidence
              </span>
            </h1>

            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Complete internal management system for humanitarian organizations.
              Multi-tenant SaaS or self-hosted. Secure, offline-capable, and built for the field.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="text-base px-8">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" className="text-base px-8 bg-white/20 border-2 border-white text-white hover:bg-white hover:text-slate-900 backdrop-blur-sm">
                  Request Demo
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything Your NGO Needs
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              From beneficiary tracking to financial management, Jambi Core has you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: 'Multi-Branch Structure',
                description: 'Manage HQ, regional branches, and field offices with hierarchical access control.',
              },
              {
                icon: Users,
                title: 'Beneficiary Management',
                description: 'Track individuals and households with flexible identifiers and enrollment.',
              },
              {
                icon: Shield,
                title: 'Protection Cases',
                description: 'Secure GBV and child protection case management with break-glass access.',
              },
              {
                icon: BarChart3,
                title: 'Finance & Reporting',
                description: 'Complete budgeting, expense tracking, and donor report generation.',
              },
              {
                icon: WifiOff,
                title: 'Offline-First',
                description: 'Full functionality even without internet. Sync when connected.',
              },
              {
                icon: Globe,
                title: 'Multi-Currency',
                description: 'Support for USD, SSP, and other currencies with automatic tracking.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deployment Options */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Deploy Your Way
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Choose SaaS for simplicity or self-host for complete control.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-indigo-100 dark:border-indigo-800">
              <div className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm uppercase tracking-wider mb-4">
                SaaS
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Cloud Hosted
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                We handle infrastructure, updates, and security. You focus on your mission.
              </p>
              <ul className="space-y-3 mb-8">
                {['Instant setup', 'Automatic updates', 'Managed backups', '99.9% uptime SLA'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/pricing">
                <Button className="w-full">View SaaS Pricing</Button>
              </Link>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="text-slate-600 dark:text-slate-400 font-semibold text-sm uppercase tracking-wider mb-4">
                Self-Hosted
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Your Infrastructure
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Full source access. Deploy on your servers with complete data ownership.
              </p>
              <ul className="space-y-3 mb-8">
                {['Full source code', 'Data sovereignty', 'Custom integrations', 'No recurring fees'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/pricing#self-hosted">
                <Button variant="outline" className="w-full">View Self-Hosted Options</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your NGO Operations?
          </h2>
          <p className="text-xl text-indigo-100 mb-10">
            Join humanitarian organizations worldwide using Jambi Core.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="text-base px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" className="text-base px-8 bg-white/20 border-2 border-white text-white hover:bg-white hover:text-indigo-600 backdrop-blur-sm">
                Talk to Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">JC</span>
                </div>
                <span className="text-lg font-bold text-white">Jambi Core</span>
              </div>
              <p className="text-sm">
                Production-ready NGO management for the modern humanitarian sector.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} Jambi Core. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
