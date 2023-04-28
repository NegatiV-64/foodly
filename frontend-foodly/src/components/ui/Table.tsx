import { cn } from '@/utils/cn.util';
import type { ComponentPropsWithoutRef, FC } from 'react';

export const Table:FC<TableProps> = ({className, children, ...styles}) => {
    return (
        <table
            className={cn(
                'min-w-full divide-y divide-gray-300',
                className
            )}
            {...styles}
        >
            {children}
        </table>
    );
};

type TableProps = ComponentPropsWithoutRef<'table'>;