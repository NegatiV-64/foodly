import { cn } from '@/utils/cn.util';
import type { ComponentPropsWithoutRef, FC } from 'react';

export const TableBody: FC<TableBodyProps> = ({ className, children, ...props }) => {
    return (
        <tbody
            className={cn(
                '',
                className
            )}
            {...props}
        >
            {children}
        </tbody>
    );
};

type TableBodyProps = ComponentPropsWithoutRef<'tbody'>;