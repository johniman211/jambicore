import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, icon, ...props }, ref) => {
        return (
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        'flex h-11 w-full rounded-lg border bg-white px-4 py-2 text-sm shadow-sm transition-all duration-200',
                        'placeholder:text-slate-400',
                        'focus:outline-none focus:ring-2 focus:ring-offset-0',
                        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
                        'dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500',
                        icon && 'pl-10',
                        error
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-600'
                            : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700 dark:focus:border-indigo-400',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">{error}</p>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };
