import { forwardRef } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/utils/cn.util';

export const Container = forwardRef<HTMLDivElement, ContainerProps>((
    { children, className, ...props },
    ref
) => {
    return (
        <div
            className={cn('container mx-auto px-5', className)}
            ref={ref}
            {...props}
        >
            {children}
        </div>
    );
});

Container.displayName = 'Container';

type ContainerProps = ComponentPropsWithRef<'div'>;