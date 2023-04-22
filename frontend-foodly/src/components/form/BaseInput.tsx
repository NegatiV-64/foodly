import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/utils/cn.util';

export const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>((
    { className, ...props }, ref
) => {
    return (
        <input
            ref={ref}
            className={cn(
                'block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm',
                className
            )}
            {...props}
        />
    );
});

BaseInput.displayName = 'BaseInput';

type BaseInputProps = ComponentPropsWithoutRef<'input'>;