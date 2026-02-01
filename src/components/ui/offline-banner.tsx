'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { WifiOff, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './button';

interface OfflineBannerProps {
    pendingCount?: number;
    onSync?: () => void;
    isSyncing?: boolean;
    lastSyncTime?: Date | null;
}

export function OfflineBanner({
    pendingCount = 0,
    onSync,
    isSyncing = false,
    lastSyncTime
}: OfflineBannerProps) {
    const [isOnline, setIsOnline] = React.useState(true);

    React.useEffect(() => {
        setIsOnline(navigator.onLine);

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (isOnline && pendingCount === 0) {
        return null;
    }

    return (
        <div
            className={cn(
                'fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50',
                'rounded-xl shadow-2xl border p-4',
                'transition-all duration-300 animate-in slide-in-from-bottom-5',
                isOnline
                    ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'
                    : 'bg-slate-900 border-slate-700 text-white'
            )}
        >
            <div className="flex items-start gap-3">
                <div
                    className={cn(
                        'flex-shrink-0 p-2 rounded-lg',
                        isOnline ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-slate-800'
                    )}
                >
                    {isOnline ? (
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                    ) : (
                        <WifiOff className="h-5 w-5 text-slate-400" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <p className={cn(
                        'font-semibold text-sm',
                        isOnline ? 'text-amber-800 dark:text-amber-200' : 'text-white'
                    )}>
                        {isOnline ? 'Pending Changes' : 'You\'re Offline'}
                    </p>
                    <p className={cn(
                        'text-sm mt-0.5',
                        isOnline ? 'text-amber-700 dark:text-amber-300' : 'text-slate-400'
                    )}>
                        {isOnline
                            ? `${pendingCount} change${pendingCount !== 1 ? 's' : ''} waiting to sync`
                            : 'Changes will sync when you\'re back online'}
                    </p>

                    {lastSyncTime && (
                        <p className="text-xs mt-1 text-slate-500">
                            Last synced: {lastSyncTime.toLocaleTimeString()}
                        </p>
                    )}
                </div>

                {isOnline && onSync && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onSync}
                        disabled={isSyncing}
                        className="flex-shrink-0"
                    >
                        <RefreshCw className={cn('h-4 w-4', isSyncing && 'animate-spin')} />
                        {isSyncing ? 'Syncing' : 'Sync'}
                    </Button>
                )}
            </div>
        </div>
    );
}

// Sync status indicator for navigation
interface SyncStatusProps {
    pendingCount?: number;
    isSyncing?: boolean;
}

export function SyncStatus({ pendingCount = 0, isSyncing = false }: SyncStatusProps) {
    const [isOnline, setIsOnline] = React.useState(true);

    React.useEffect(() => {
        setIsOnline(navigator.onLine);

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <div className="flex items-center gap-2 text-sm">
            {!isOnline ? (
                <>
                    <WifiOff className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-500">Offline</span>
                </>
            ) : isSyncing ? (
                <>
                    <RefreshCw className="h-4 w-4 text-indigo-500 animate-spin" />
                    <span className="text-indigo-600">Syncing...</span>
                </>
            ) : pendingCount > 0 ? (
                <>
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span className="text-amber-600">{pendingCount} pending</span>
                </>
            ) : (
                <>
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span className="text-emerald-600">Synced</span>
                </>
            )}
        </div>
    );
}
