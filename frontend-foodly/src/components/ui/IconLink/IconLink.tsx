import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/utils/cn.util';
import Link from 'next/link';

export const IconLink = forwardRef<HTMLAnchorElement, IconLinkProps>(({
    size = 'medium',
    color = 'default',
    variant = 'contained',
    href,
    children,
    className,
    ...props },
    ref
) => {
    return (
        <Link
            {...props}
            href={href}
            className={cn(
                'flex items-center justify-center select-none outline-none duration-200 rounded-full shadow-sm focus:outline-none h-min text-center no-underline',
                'disabled:bg-neutral-400 disabled:hover:cursor-not-allowed',
                {
                    'p-1.5 text-sm': size === 'small',
                    'p-2 text-base': size === 'medium',
                    'p-3 text-lg': size === 'large',
                },
                {
                    'bg-orange-500 text-white border-orange-500 hover:bg-orange-600': color === 'default',
                    'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600 focus:shadow-emerald-100': color === 'success',
                    'bg-amber-500 text-white border-amber-500 hover:bg-amber-600 focus:shadow-amber-100': color === 'warning',
                    'bg-red-600 text-white border-red-600 hover:bg-red-700 focus:shadow-red-100': color === 'error',
                },
                {
                    'border': variant === 'contained',
                    'border bg-transparent': variant === 'outlined',
                    'border border-transparent bg-transparent hover:bg-transparent': variant === 'text',
                },
                'border border-transparent',
                className
            )}
            ref={ref}
        >
            {
                children
            }
        </Link>
    );
});

IconLink.displayName = 'IconLink';

type IconLinkProps = ComponentPropsWithoutRef<typeof Link> & {
    size?: 'small' | 'medium' | 'large';
    variant?: 'contained' | 'outlined' | 'text';
    color?: 'default' | 'success' | 'warning' | 'error';
};