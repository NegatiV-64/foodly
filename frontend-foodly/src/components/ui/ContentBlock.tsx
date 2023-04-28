import { cn } from '@/utils/cn.util';
import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
import { Heading } from './Heading';

export const ContentBlock: FC<ContentBlockProps> = ({
    children, className, title, ...props
}) => {
    return (
        <div
            className={cn('tw-flex tw-flex-col tw-gap-2', className)}
            {...props}
        >
            <Heading as='h4' weight='normal' size='lg' className='text-slate-500'>
                {title}
            </Heading>
            {children}
        </div>
    );
};

type ContentBlockProps = ComponentPropsWithoutRef<'div'> & {
    title: ReactNode;
};