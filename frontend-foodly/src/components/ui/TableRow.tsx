import { cn } from '@/utils/cn.util';
import type { ComponentPropsWithoutRef, FC } from 'react';

export const TableRow:FC<TableRowProps> = ({ className, children, ...props }) => {
    return (
        <tr
            className={cn(
                'rounded-lg overflow-hidden',
                className
            )}
            {...props}
        >
            {children}
        </tr>
    );
};

type TableRowProps = ComponentPropsWithoutRef<'tr'>;