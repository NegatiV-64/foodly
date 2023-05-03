import type { ComponentPropsWithoutRef, FC } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Colors } from '../../styles/colors';

export const ContentText: FC<ContentTextProps> = ({ style, children, ...props }) => {
    return (
        <Text
            style={StyleSheet.flatten([styles.text, style])}
            {...props}
        >
            {children}
        </Text>
    );
};

type ContentTextProps = ComponentPropsWithoutRef<typeof Text>;

const styles = StyleSheet.create({
    text: {
        fontWeight: '400',
        color: Colors.stone[900],
        fontSize: 18,
    },
});