import { cn } from '@/utils/cn.util';
import type { ComponentPropsWithoutRef, FC } from 'react';

export const Section: FC<SectionProps> = ({ children, className, ...props }) => {
    return (
        <section
            className={cn(
                'py-10',
                className
            )}
            {...props}
        >
            {children}
        </section>
    );
};

type SectionProps = ComponentPropsWithoutRef<'section'>;