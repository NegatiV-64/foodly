import { cn } from '@/utils/cn.util';
import type { ComponentPropsWithoutRef, FC } from 'react';

export const ContentColumn:FC<ContentColumnProps> = ({
    children, className, ...props
}) => {
    return (
        <div
            className={cn('flex flex-col gap-5 h-full', className)}
            {...props}
        >
            {children}
        </div>
    );
};

type ContentColumnProps = ComponentPropsWithoutRef<'div'>;