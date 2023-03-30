import { Heading } from '@/components/ui/Heading';
import { Title } from '@radix-ui/react-dialog';
import type { ComponentPropsWithoutRef, FC } from 'react';

export const DialogTitle: FC<DialogTitleProps> = ({ children, className, ...props }) => {
    return (
        <Title asChild={true}>
            <Heading className={className} {...props}>
                {children}
            </Heading>
        </Title>
    );
};


type DialogTitleProps = ComponentPropsWithoutRef<typeof Heading>;