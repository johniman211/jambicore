import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
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

            {/* Content */}
            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-8">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                                Privacy Policy
                            </h1>
                            <p className="text-slate-500">Last updated: January 31, 2026</p>
                        </div>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="lead">
                            At Jambi Core, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                        </p>

                        <h2>1. Information We Collect</h2>

                        <h3>1.1 Information You Provide</h3>
                        <p>We collect information you provide directly to us, including:</p>
                        <ul>
                            <li><strong>Account Information:</strong> Name, email address, password, organization name, and role when you register for an account.</li>
                            <li><strong>Profile Information:</strong> Phone number, job title, and profile picture if you choose to provide them.</li>
                            <li><strong>Organization Data:</strong> Information about beneficiaries, projects, cases, distributions, and financial data that you enter into the platform.</li>
                            <li><strong>Communications:</strong> Information you provide when you contact us for support or feedback.</li>
                        </ul>

                        <h3>1.2 Information Collected Automatically</h3>
                        <p>When you use our platform, we automatically collect:</p>
                        <ul>
                            <li><strong>Usage Data:</strong> Pages visited, features used, actions taken, and time spent on the platform.</li>
                            <li><strong>Device Information:</strong> Browser type, operating system, device type, and IP address.</li>
                            <li><strong>Log Data:</strong> Access times, error logs, and referring URLs.</li>
                        </ul>

                        <h2>2. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul>
                            <li>Provide, maintain, and improve our services</li>
                            <li>Process transactions and manage your account</li>
                            <li>Send you technical notices, updates, and support messages</li>
                            <li>Respond to your comments and questions</li>
                            <li>Monitor and analyze usage patterns and trends</li>
                            <li>Detect, investigate, and prevent fraudulent transactions and unauthorized access</li>
                            <li>Comply with legal obligations</li>
                        </ul>

                        <h2>3. Data Sharing and Disclosure</h2>
                        <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
                        <ul>
                            <li><strong>Within Your Organization:</strong> Data is shared with other members of your organization based on their role and permissions.</li>
                            <li><strong>Service Providers:</strong> We work with third-party service providers who need access to your information to support our operations (e.g., hosting, analytics).</li>
                            <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights and safety.</li>
                            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your information may be transferred.</li>
                        </ul>

                        <h2>4. Data Security</h2>
                        <p>We implement robust security measures to protect your data:</p>
                        <ul>
                            <li>End-to-end encryption for data in transit (TLS 1.3)</li>
                            <li>Encryption at rest using AES-256</li>
                            <li>Row-level security ensuring data isolation between organizations</li>
                            <li>Regular security audits and penetration testing</li>
                            <li>Multi-factor authentication options</li>
                            <li>24/7 security monitoring</li>
                        </ul>

                        <h2>5. Data Retention</h2>
                        <p>We retain your information for as long as your account is active or as needed to provide you services. You may request deletion of your data at any time, subject to legal and contractual obligations.</p>

                        <h2>6. Your Rights</h2>
                        <p>Depending on your location, you may have the following rights:</p>
                        <ul>
                            <li><strong>Access:</strong> Request a copy of your personal data</li>
                            <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                            <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                            <li><strong>Portability:</strong> Request your data in a machine-readable format</li>
                            <li><strong>Objection:</strong> Object to certain processing of your data</li>
                            <li><strong>Restriction:</strong> Request restriction of processing</li>
                        </ul>

                        <h2>7. International Data Transfers</h2>
                        <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place, including Standard Contractual Clauses where required.</p>

                        <h2>8. Sensitive Data</h2>
                        <p>We understand that humanitarian organizations handle sensitive data, including information about vulnerable populations, GBV cases, and child protection matters. We implement additional security measures for such data, including:</p>
                        <ul>
                            <li>Restricted access controls</li>
                            <li>Enhanced audit logging</li>
                            <li>Break-glass access procedures</li>
                            <li>Online-only access (no offline caching for sensitive cases)</li>
                        </ul>

                        <h2>9. Cookies and Tracking</h2>
                        <p>We use cookies and similar technologies to:</p>
                        <ul>
                            <li>Keep you logged in</li>
                            <li>Remember your preferences</li>
                            <li>Understand how you use our platform</li>
                            <li>Improve our services</li>
                        </ul>
                        <p>You can control cookies through your browser settings.</p>

                        <h2>10. Children&apos;s Privacy</h2>
                        <p>Our platform is not directed to children under 18. We do not knowingly collect personal information from children. If we learn that we have collected personal information from a child, we will take steps to delete it.</p>

                        <h2>11. Changes to This Policy</h2>
                        <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the &ldquo;Last updated&rdquo; date.</p>

                        <h2>12. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                        <ul>
                            <li>Email: privacy@jambicore.org</li>
                            <li>Address: Plot 123, Kololo Road, Juba, South Sudan</li>
                        </ul>

                        <div className="mt-12 p-6 bg-slate-100 dark:bg-slate-800 rounded-xl">
                            <h3 className="text-lg font-semibold mb-2">Questions?</h3>
                            <p className="mb-4">If you have any questions about our privacy practices, we&apos;re here to help.</p>
                            <Link href="/contact">
                                <Button>Contact Us</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-slate-400">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">JC</span>
                        </div>
                        <span className="text-lg font-bold text-white">Jambi Core</span>
                    </div>
                    <div className="flex items-center justify-center gap-6 text-sm">
                        <Link href="/privacy" className="text-white transition-colors">Privacy Policy</Link>
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
