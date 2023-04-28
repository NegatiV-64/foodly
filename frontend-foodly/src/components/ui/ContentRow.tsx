import { cn } from '@/utils/cn.util';
import type { ComponentPropsWithoutRef, FC } from 'react';

export const ContentRow:FC<ContentRowProps> = ({
    children, className, ...props
}) => {
    return (
        <div
            className={cn('px-7 pt-5 pb-7 bg-white rounded-lg', className)}
            {...props}
        >
            {children}
        </div>
    );
};

type ContentRowProps = ComponentPropsWithoutRef<'div'>;