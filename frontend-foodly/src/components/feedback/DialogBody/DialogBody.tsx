import { cn } from '@/utils/cn.util';
import type { ComponentPropsWithoutRef, FC } from 'react';

export const DialogBody:FC<DialogBodyProps> = ({children, className, ...props }) => {
    return (
        <div className={cn('w-full', className)} {...props}>
            {children}
        </div>
    );
};

type DialogBodyProps = ComponentPropsWithoutRef<'div'>;