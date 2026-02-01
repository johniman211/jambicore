'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

const Avatar = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
        size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    }
>(({ className, size = 'md', ...props }, ref) => (
    <AvatarPrimitive.Root
        ref={ref}
        className={cn(
            'relative flex shrink-0 overflow-hidden rounded-full',
            {
                'h-6 w-6 text-xs': size === 'xs',
                'h-8 w-8 text-sm': size === 'sm',
                'h-10 w-10 text-sm': size === 'md',
                'h-12 w-12 text-base': size === 'lg',
                'h-16 w-16 text-lg': size === 'xl',
            },
            className
        )}
        {...props}
    />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Image>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
        ref={ref}
        className={cn('aspect-square h-full w-full object-cover', className)}
        {...props}
    />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Fallback>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
            'flex h-full w-full items-center justify-center rounded-full',
            'bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-medium',
            className
        )}
        {...props}
    />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

// Convenience component
interface UserAvatarProps {
    name: string;
    src?: string | null;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

function UserAvatar({ name, src, size = 'md', className }: UserAvatarProps) {
    return (
        <Avatar size={size} className={className}>
            {src && <AvatarImage src={src} alt={name} />}
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
    );
}

export { Avatar, AvatarImage, AvatarFallback, UserAvatar };
