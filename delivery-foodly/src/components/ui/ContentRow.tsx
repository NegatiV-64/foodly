import type { ComponentPropsWithoutRef, FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../styles/colors';

export const ContentRow: FC<ContentRowProps> = ({ style, children, ...props }) => {
    return (
        <View
            style={StyleSheet.flatten([styles.row, style])}
            {...props}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: Colors.gray[50],
        borderRadius: 8,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 1.00,
        elevation: 1

    }
});

type ContentRowProps = ComponentPropsWithoutRef<typeof View>;