import { cn } from '@/utils/cn.util';
import NextLink from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { forwardRef } from 'react';

export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
    const {
        href, children, className,
        size = 'medium', variant = 'contained', color = 'default',
        startIcon, endIcon,
        ...otherProps
    } = props;

    return (
        <NextLink
            className={cn(
                'rounded-md inline-flex items-center justify-center gap-1 touch-manipulation will-change-[background,_box-shadow] select-none h-min text-center no-underline transform-none border-none outline-none shadow-elevation-1 duration-200',
                'focus:shadow-element-focus',
                'disabled:bg-neutral-400 disabled:hover:cursor-not-allowed disabled:hover:shadow-elevation-1',
                {
                    'px-3 py-2 text-sm': size === 'small',
                    'px-4 py-2 text-base': size === 'medium',
                    'px-5 py-2 text-lg': size === 'large',
                },
                {
                    'bg-orange-500 text-white hover:text-white border-orange-500 hover:bg-orange-600 focus:shadow-orange-100': color === 'default',
                    'bg-emerald-500 text-white hover:text-white border-emerald-500 hover:bg-emerald-600 focus:shadow-emerald-100': color === 'success',
                    'bg-amber-500 text-white hover:text-white border-amber-500 hover:bg-amber-600 focus:shadow-amber-100': color === 'warning',
                    'bg-red-600 text-white hover:text-white border-red-600 hover:bg-red-700 focus:shadow-red-100': color === 'error',
                },
                {
                    'border': variant === 'contained',
                    'border bg-transparent': variant === 'outlined',
                    'border border-transparent': variant === 'text',
                    'border border-transparent underline underline-offset-4': variant === 'underline',
                },
                className,
            )}
            href={href}
            {...otherProps}
            ref={ref}
        >
            {
                startIcon !== undefined &&
                <span className={'flex items-center justify-center'}>
                    {startIcon}
                </span>
            }
            {children}
            {
                endIcon !== undefined &&
                <span className={'flex items-center justify-center'}>
                    {endIcon}
                </span>
            }
        </NextLink>
    );
});

Link.displayName = 'Link';

type LinkProps = ComponentPropsWithoutRef<typeof NextLink> & {
    size?: 'small' | 'medium' | 'large';
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    variant?: 'contained' | 'outlined' | 'text' | 'underline';
    color?: 'default' | 'success' | 'warning' | 'error';
};