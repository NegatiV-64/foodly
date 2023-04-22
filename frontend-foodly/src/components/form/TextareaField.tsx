import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import FormField from './FormField';
import { BaseLabel } from './BaseLabel';
import { BaseTextarea } from './BaseTextarea';

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(({
    label, labelProps, formFieldProps, id, required, ...props
}, ref) => {
    return (
        <FormField {...formFieldProps}>
            {
                label !== undefined && (
                    <BaseLabel
                        htmlFor={id}
                        required={required}
                        {...labelProps}
                    >
                        {label}
                    </BaseLabel>
                )
            }
            <BaseTextarea
                id={id}
                {...props}
                ref={ref}
            />
        </FormField>
    );
});

type TextAreaFieldProps = ComponentPropsWithoutRef<typeof BaseTextarea> & {
    label?: ReactNode;
    labelProps?: Omit<ComponentPropsWithoutRef<typeof BaseLabel>, 'required'>;
    formFieldProps?: ComponentPropsWithoutRef<typeof FormField>;
};

TextAreaField.displayName = 'TextAreaField';