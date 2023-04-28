import { cn } from '@/utils/cn.util';
import type { ComponentPropsWithoutRef, FC } from 'react';

export const TableHead: FC<TableHeadProps> = ({ tableRow, className, children, ...props}) => {
    return (
        <thead
            className={cn(className)}
            {...props}
        >
            <tr {...tableRow}>
                {children}
            </tr>
        </thead>
    );
};

export type TableHeadProps = ComponentPropsWithoutRef<'thead'> & {
    tableRow?: ComponentPropsWithoutRef<'tr'>;
};