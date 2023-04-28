import { cn } from '@/utils/cn.util';
import type { ComponentPropsWithoutRef, FC } from 'react';

export const TableHeadCell: FC<TableHeadCellProps> = ({ className, children, ...props }) => {
    return (
        <th
            scope='col'
            className={cn(
                'px-3 py-1.5 text-left text-sm font-semibold text-gray-900 lg:table-cell',
                className
            )}
            {...props}
        >
            {children}
        </th>
    );
};

type TableHeadCellProps = ComponentPropsWithoutRef<'th'>;