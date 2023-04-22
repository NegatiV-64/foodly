import type { ComponentPropsWithoutRef} from 'react';
import { forwardRef } from 'react';
import { cn } from '@/utils/cn.util';

export const BaseLabel = forwardRef<HTMLLabelElement, BaseLabelProps>((
    { className, children, required, ...props }, ref
) => {
    return (
        <label
            className={cn(
                'block text-sm font-medium text-gray-700',
                className
            )}
            {...props}
            ref={ref}
        >
            {children}{' '}
            {required && (
                <span className='text-red-600' aria-hidden='true'>
                    *
                </span>
            )}
        </label>
    );
});

BaseLabel.displayName = 'BaseLabel';

type BaseLabelProps = ComponentPropsWithoutRef<'label'> & {
    required?: boolean;
};