import type { ComponentPropsWithoutRef, FC } from 'react';
import { StyleSheet, View } from 'react-native';

export const Container:FC<ContainerProps> = ({ children, style, ...props }) => {
    return (
        <View
            style={StyleSheet.flatten([styles.container, style])}
            {...props}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
    }
});

type ContainerProps = ComponentPropsWithoutRef<typeof View>;