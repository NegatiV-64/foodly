import type { FC, ComponentPropsWithoutRef } from 'react';
import { Platform, ScrollView } from 'react-native';

export const ScrollableView: FC<ScrollableViewProps> = ({ children, ...props }) => {
    return (
        <ScrollView
            scrollIndicatorInsets={{ right: Platform.OS === 'ios' ? 1 : undefined }}
            {...props}
        >
            {children}
        </ScrollView>
    );
};

type ScrollableViewProps = ComponentPropsWithoutRef<typeof ScrollView>;