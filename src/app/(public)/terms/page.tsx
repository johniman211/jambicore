import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
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
                            <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                                Terms of Service
                            </h1>
                            <p className="text-slate-500">Last updated: January 31, 2026</p>
                        </div>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="lead">
                            Welcome to Jambi Core. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully.
                        </p>

                        <h2>1. Acceptance of Terms</h2>
                        <p>By creating an account or using the Jambi Core platform (&ldquo;Service&rdquo;), you agree to these Terms of Service (&ldquo;Terms&rdquo;) and our Privacy Policy. If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.</p>

                        <h2>2. Description of Service</h2>
                        <p>Jambi Core is a comprehensive NGO management platform that provides:</p>
                        <ul>
                            <li>Beneficiary and household management</li>
                            <li>Project and activity tracking</li>
                            <li>Case management including protection cases</li>
                            <li>Distribution planning and recording</li>
                            <li>Financial management and reporting</li>
                            <li>Document management</li>
                            <li>Offline functionality</li>
                        </ul>

                        <h2>3. Account Registration</h2>
                        <h3>3.1 Account Creation</h3>
                        <p>To use the Service, you must create an account with accurate and complete information. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</p>

                        <h3>3.2 Organization Accounts</h3>
                        <p>Organization administrators are responsible for managing user access, permissions, and ensuring compliance with these Terms by all users within their organization.</p>

                        <h2>4. Acceptable Use</h2>
                        <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
                        <ul>
                            <li>Use the Service in any way that violates applicable laws or regulations</li>
                            <li>Attempt to gain unauthorized access to any part of the Service</li>
                            <li>Interfere with or disrupt the Service or servers connected to the Service</li>
                            <li>Use the Service to store or transmit malicious code</li>
                            <li>Collect or harvest any information from other users without consent</li>
                            <li>Use the Service for any purpose other than managing legitimate NGO operations</li>
                            <li>Share login credentials or access tokens with unauthorized parties</li>
                        </ul>

                        <h2>5. Data and Content</h2>
                        <h3>5.1 Your Data</h3>
                        <p>You retain all rights to the data you enter into the Service (&ldquo;Your Data&rdquo;). You grant us a limited license to use Your Data solely to provide and improve the Service.</p>

                        <h3>5.2 Data Protection</h3>
                        <p>You are responsible for ensuring that you have proper consent and legal basis for collecting and processing personal data through the Service, particularly for sensitive data such as:</p>
                        <ul>
                            <li>Protection case information</li>
                            <li>Health records</li>
                            <li>Information about vulnerable populations</li>
                            <li>Children&apos;s data</li>
                        </ul>

                        <h3>5.3 Data Export</h3>
                        <p>You may export Your Data at any time through the Service&apos;s export functionality.</p>

                        <h2>6. Subscription and Payment</h2>
                        <h3>6.1 Subscription Plans</h3>
                        <p>Access to the Service is provided through various subscription plans. Details of current plans and pricing are available on our pricing page.</p>

                        <h3>6.2 Payment Terms</h3>
                        <ul>
                            <li>Subscriptions are billed in advance on a monthly or annual basis</li>
                            <li>All fees are non-refundable except as required by law</li>
                            <li>We reserve the right to modify prices with 30 days&apos; notice</li>
                            <li>Failure to pay may result in suspension of access</li>
                        </ul>

                        <h3>6.3 Free Trial</h3>
                        <p>We may offer a free trial period. At the end of the trial, your account will be converted to a paid subscription unless you cancel.</p>

                        <h2>7. Self-Hosted Licenses</h2>
                        <p>For self-hosted deployments:</p>
                        <ul>
                            <li>Licenses are granted per organization</li>
                            <li>You are responsible for your own infrastructure and maintenance</li>
                            <li>Source code is provided under the terms of the applicable license</li>
                            <li>Support is available as a separate service</li>
                        </ul>

                        <h2>8. Service Availability</h2>
                        <h3>8.1 Uptime</h3>
                        <p>We strive to maintain 99.9% uptime for our SaaS platform. Scheduled maintenance will be announced in advance when possible.</p>

                        <h3>8.2 Beta Features</h3>
                        <p>Some features may be offered in beta. Beta features are provided &ldquo;as is&rdquo; and may be modified or discontinued without notice.</p>

                        <h2>9. Intellectual Property</h2>
                        <p>The Service, including all software, design, text, graphics, and other content, is owned by Jambi Core and is protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works without our express permission.</p>

                        <h2>10. Limitation of Liability</h2>
                        <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
                        <ul>
                            <li>THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; WITHOUT WARRANTIES OF ANY KIND</li>
                            <li>WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES</li>
                            <li>OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU IN THE TWELVE MONTHS PRECEDING THE CLAIM</li>
                        </ul>

                        <h2>11. Indemnification</h2>
                        <p>You agree to indemnify and hold harmless Jambi Core and its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.</p>

                        <h2>12. Termination</h2>
                        <h3>12.1 By You</h3>
                        <p>You may terminate your account at any time by contacting us. You will have 30 days to export Your Data before deletion.</p>

                        <h3>12.2 By Us</h3>
                        <p>We may suspend or terminate your access if you violate these Terms or for any reason with 30 days&apos; notice.</p>

                        <h3>12.3 Effect of Termination</h3>
                        <p>Upon termination, your right to use the Service will cease immediately. Provisions that by their nature should survive termination will remain in effect.</p>

                        <h2>13. Changes to Terms</h2>
                        <p>We may modify these Terms at any time. We will provide notice of material changes at least 30 days before they take effect. Continued use of the Service after changes constitutes acceptance.</p>

                        <h2>14. Governing Law</h2>
                        <p>These Terms are governed by the laws of Switzerland. Any disputes will be resolved in the courts of Geneva, Switzerland.</p>

                        <h2>15. Dispute Resolution</h2>
                        <p>Before initiating legal proceedings, parties agree to attempt to resolve disputes through good-faith negotiation for at least 30 days.</p>

                        <h2>16. General Provisions</h2>
                        <ul>
                            <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and Jambi Core.</li>
                            <li><strong>Severability:</strong> If any provision is found invalid, the remaining provisions will continue in effect.</li>
                            <li><strong>Waiver:</strong> Failure to enforce any provision does not constitute a waiver.</li>
                            <li><strong>Assignment:</strong> You may not assign your rights under these Terms without our consent.</li>
                        </ul>

                        <h2>17. Contact Information</h2>
                        <p>For questions about these Terms, please contact us at:</p>
                        <ul>
                            <li>Email: legal@jambicore.org</li>
                            <li>Address: Plot 123, Kololo Road, Juba, South Sudan</li>
                        </ul>

                        <div className="mt-12 p-6 bg-slate-100 dark:bg-slate-800 rounded-xl">
                            <h3 className="text-lg font-semibold mb-2">Questions?</h3>
                            <p className="mb-4">If you have any questions about these Terms, we&apos;re here to help.</p>
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
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="text-white transition-colors">Terms of Service</Link>
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
