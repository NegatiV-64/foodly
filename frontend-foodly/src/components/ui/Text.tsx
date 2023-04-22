import { cn } from '@/utils/cn.util';
import type { ComponentPropsWithRef } from 'react';
import { forwardRef } from 'react';

export const Text = forwardRef<HTMLDivElement, TextProps>(({
    as, weight = 'normal', color = 'default', size = 'base', className, children, ...props
}, ref) => {
    const Component = as || 'p';

    return (
        <Component
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
                    'text-xs': size === 'xs',
                    'text-sm': size === 'sm',
                    'text-base': size === 'base',
                    'text-lg': size === 'lg',
                    'text-xl': size === 'xl',
                    'text-2xl': size === '2xl',
                    'text-3xl': size === '3xl',
                },
                className
            )}
            ref={ref}
            {...props}
        >
            {children}
        </Component>
    );
});

type TextProps = Omit<ComponentPropsWithRef<'p'>, 'color'> & {
    as?: 'p' | 'span' | 'div';
    weight?: TextWeights;
    color?: TextColors;
    size?: TextSize;
};

Text.displayName = 'Text';

type TextColors = 'default' | 'success' | 'warning' | 'error';

type TextWeights = 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';

type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';