import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, FC, ForwardedRef } from 'react';
import { cn } from '@/utils/cn.util';

export const Heading: FC<HeadingProps> = forwardRef(({
    as = 'h2',
    children,
    color,
    weight = 'medium',
    size = '2xl',
    className,
    ...props
}, ref: ForwardedRef<HTMLHeadingElement>) => {
    const Tag = as as HeadingElements;

    return (
        <Tag
            className={cn(
                {
                    'font-thin': weight === 'thin',
                    'font-extralight': weight === 'extralight',
                    'font-light': weight === 'light',
                    'font-normal': weight === 'normal',
                    'font-medium': weight === 'medium',
                    'font-semibold': weight === 'semibold',
                    'font-bold': weight === 'bold',
                    'font-extrabold': weight === 'extrabold',
                    'font-black': weight === 'black',
                },
                {
                    'text-stone-900': color === 'default',
                    'text-emerald-500': color === 'success',
                    'text-amber-500': color === 'warning',
                    'text-red-600': color === 'error',
                },
                {
                    'text-lg': size === 'lg',
                    'text-xl': size === 'xl',
                    'text-2xl': size === '2xl',
                    'text-3xl': size === '3xl',
                    'text-4xl': size === '4xl',
                    'text-5xl': size === '5xl',
                    'text-6xl': size === '6xl',
                    'text-7xl': size === '7xl',
                    'text-8xl': size === '8xl',
                },
                className
            )}
            ref={ref}
            {...props}
        >
            {children}
        </Tag>
    );
});

Heading.displayName = 'Heading';

type HeadingProps = ComponentPropsWithoutRef<'h1'> & {
    as?: HeadingElements;
    weight?: HeadingWeights;
    color?: HeadingColors;
    size?: HeadingSizes;
};

type HeadingElements = 'h1' | 'h2' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HeadingWeights = 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
type HeadingColors = 'default' | 'success' | 'warning' | 'error';
type HeadingSizes = 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl';
