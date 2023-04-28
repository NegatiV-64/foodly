import { cn } from '@/utils/cn.util';
import type { ComponentPropsWithoutRef, FC } from 'react';

export const TableCell:FC<TableCellProps> = ({ className, children, ...props }) => {
    return (
        <td
        scope='col'

            className={cn(
                'border-b border-b-gray-300 border-solid px-3 py-1.5',
                className
            )}
            {...props}
        >
            {children}
        </td>
    );
};

type TableCellProps = ComponentPropsWithoutRef<'td'>;