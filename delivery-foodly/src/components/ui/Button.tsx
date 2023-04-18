import type { ComponentPropsWithoutRef, FC } from 'react';
import { Button as MDButton } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';

export const Button: FC<ButtonProps> = ({ children, style, ...props}) => {
    return (
        <MDButton
            style={[styles.button, style]}
            {...props}
        >
            {children}
        </MDButton>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.amber[500],
    },
});

type ButtonProps = ComponentPropsWithoutRef<typeof MDButton>;