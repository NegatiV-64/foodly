import { cn } from '@/utils/cn.util';
import type { ComponentPropsWithoutRef, FC } from 'react';

export const DialogFooter:FC<DialogFooterProps> = ({className, children, ...props}) => {
    return (
        <footer className={cn('w-full', className)} {...props}>
            {children}
        </footer>
    );
};

type DialogFooterProps = ComponentPropsWithoutRef<'footer'>;