import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { BaseInput } from './BaseInput';
import FormField from './FormField';
import { BaseLabel } from './BaseLabel';

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({
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
            <BaseInput
                id={id}
                {...props}
                ref={ref}
            />
        </FormField>
    );
});

type InputFieldProps = ComponentPropsWithoutRef<typeof BaseInput> & {
    label?: ReactNode;
    labelProps?: Omit<ComponentPropsWithoutRef<typeof BaseLabel>, 'required'>;
    formFieldProps?: ComponentPropsWithoutRef<typeof FormField>;
};

InputField.displayName = 'InputField';