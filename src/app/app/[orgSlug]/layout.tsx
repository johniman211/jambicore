'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser, logout } from '@/hooks/useUser';
import {
    LayoutDashboard,
    FolderKanban,
    Users,
    Home,
    FileText,
    HandCoins,
    Wallet,
    ClipboardList,
    Package,
    FileBox,
    BarChart3,
    Download,
    Settings,
    ChevronDown,
    Bell,
    Search,
    Menu,
    X,
    Building2,
    Shield,
    LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/avatar';
import { OfflineBanner, SyncStatus } from '@/components/ui/offline-banner';

interface AppLayoutProps {
    children: React.ReactNode;
    params: Promise<{ orgSlug: string }>;
}

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Beneficiaries', href: '/beneficiaries', icon: Users },
    { name: 'Households', href: '/households', icon: Home },
    { name: 'Cases', href: '/cases', icon: Shield },
    { name: 'Distributions', href: '/distributions', icon: HandCoins },
    {
        name: 'Finance',
        href: '/finance',
        icon: Wallet,
        children: [
            { name: 'Budgets', href: '/finance/budgets' },
            { name: 'Expenses', href: '/finance/expenses' },
            { name: 'Approvals', href: '/finance/approvals' },
        ],
    },
    { name: 'Procurement', href: '/procurement/requests', icon: ClipboardList },
    { name: 'Assets', href: '/assets', icon: Package },
    { name: 'Documents', href: '/documents', icon: FileBox },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Exports', href: '/exports', icon: Download },
];

const adminNavigation = [
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Workflows', href: '/admin/workflows', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AppLayout({ children, params }: AppLayoutProps) {
    const [orgSlug, setOrgSlug] = useState<string>('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading: userLoading } = useUser();

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            setIsLoggingOut(false);
        }
    };

    // Get display name from user metadata or email
    const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
    const userRole = user?.user_metadata?.role || 'Member';

    useEffect(() => {
        params.then((p) => setOrgSlug(p.orgSlug));
    }, [params]);

    const toggleExpand = (name: string) => {
        setExpandedItems((prev) =>
            prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
        );
    };

    const isActive = (href: string) => {
        return pathname === `/app/${orgSlug}${href}` || pathname.startsWith(`/app/${orgSlug}${href}/`);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-200 lg:translate-x-0 flex flex-col',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800">
                    <Link href={`/app/${orgSlug}/dashboard`} className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">JC</span>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">Jambi Core</span>
                    </Link>
                    <button
                        className="lg:hidden text-slate-400 hover:text-slate-600"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Org selector */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <button className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                                <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[140px]">
                                    {orgSlug || 'Loading...'}
                                </p>
                                <p className="text-xs text-slate-500">Organization</p>
                            </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {navigation.map((item) => (
                        <div key={item.name}>
                            {item.children ? (
                                <>
                                    <button
                                        onClick={() => toggleExpand(item.name)}
                                        className={cn(
                                            'sidebar-item w-full justify-between',
                                            isActive(item.href) && 'sidebar-item-active'
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="w-5 h-5" />
                                            {item.name}
                                        </div>
                                        <ChevronDown
                                            className={cn(
                                                'w-4 h-4 transition-transform',
                                                expandedItems.includes(item.name) && 'rotate-180'
                                            )}
                                        />
                                    </button>
                                    {expandedItems.includes(item.name) && (
                                        <div className="ml-8 mt-1 space-y-1">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={`/app/${orgSlug}${child.href}`}
                                                    className={cn(
                                                        'sidebar-item',
                                                        isActive(child.href) && 'sidebar-item-active'
                                                    )}
                                                >
                                                    {child.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    href={`/app/${orgSlug}${item.href}`}
                                    className={cn(
                                        'sidebar-item',
                                        isActive(item.href) && 'sidebar-item-active'
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            )}
                        </div>
                    ))}

                    {/* Admin section */}
                    <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
                        <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Administration
                        </p>
                        {adminNavigation.map((item) => (
                            <Link
                                key={item.href}
                                href={`/app/${orgSlug}${item.href}`}
                                className={cn(
                                    'sidebar-item',
                                    isActive(item.href) && 'sidebar-item-active'
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Sync status */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <SyncStatus />
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Header */}
                <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between h-full px-4">
                        <div className="flex items-center gap-4">
                            <button
                                className="lg:hidden text-slate-400 hover:text-slate-600"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            {/* Search */}
                            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg w-64">
                                <Search className="w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 w-full"
                                />
                                <kbd className="hidden md:block px-2 py-0.5 text-xs bg-white dark:bg-slate-700 rounded text-slate-400">
                                    ⌘K
                                </kbd>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                            </button>

                            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                                <UserAvatar name={displayName} size="sm" />
                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                        {userLoading ? 'Loading...' : displayName}
                                    </p>
                                    <p className="text-xs text-slate-400">{userRole}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="min-h-[calc(100vh-4rem)]">
                    {children}
                </main>
            </div>

            {/* Offline banner */}
            <OfflineBanner />
        </div>
    );
}
