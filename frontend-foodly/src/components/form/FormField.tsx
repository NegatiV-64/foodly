import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/utils/cn.util';

const FormField = forwardRef<HTMLDivElement, FormFieldProps>((
    { hasSpacing = true, className, children, ...props }, ref
) => {
    return (
        <div
            className={cn(
                'flex flex-col',
                {
                    'gap-y-1': hasSpacing,
                },
                className
            )}
            ref={ref}
            {...props}
        >
            {children}
        </div>
    );
});

FormField.displayName = 'FormField';

type FormFieldProps = ComponentPropsWithoutRef<'div'> & {
    hasSpacing?: boolean;
};

export default FormField;