import type { ComponentPropsWithoutRef, FC } from 'react';
import { View, StyleSheet } from 'react-native';

export const ContentColumn: FC<ContentColumnProps> = ({ style, children, ...props }) => {
    return (
        <View
            style={StyleSheet.flatten([styles.column, style])}
            {...props}
        >
            {children}
        </View>
    );
};

type ContentColumnProps = ComponentPropsWithoutRef<typeof View>;

const styles = StyleSheet.create({
    column: {
        flexDirection: 'column',
        gap: 10,
        flex: 1,
        height: '100%'
    }
});