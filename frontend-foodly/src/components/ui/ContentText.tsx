import type { ComponentPropsWithoutRef, FC } from 'react';
import { Text } from './Text';

export const ContentText: FC<ContentTextProps> = ({
    children, ...props
}) => {
    return (
        <Text
            size={'lg'}
            color={'default'}
            weight={'medium'}
            {...props}
        >
            {children}
        </Text>
    );
};

type ContentTextProps = ComponentPropsWithoutRef<typeof Text>;