import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <div className="relative">
                <textarea
                    className={cn(
                        'flex min-h-[120px] w-full rounded-lg border bg-white px-4 py-3 text-sm shadow-sm transition-all duration-200',
                        'placeholder:text-slate-400',
                        'focus:outline-none focus:ring-2 focus:ring-offset-0',
                        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
                        'dark:bg-slate-900 dark:text-slate-100',
                        'resize-y',
                        error
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-600'
                            : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700',
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
Textarea.displayName = 'Textarea';

export { Textarea };
