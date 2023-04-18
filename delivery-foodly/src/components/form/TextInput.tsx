import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';
import { TextInput as MDTextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import type { TextInput as RNTextInput } from 'react-native';
import { Colors } from '../../styles/colors';

export const TextInput = forwardRef<RNTextInput, ComponentPropsWithoutRef<typeof MDTextInput>>(
    ({ style, ...props }, ref) => {
        return (
            <MDTextInput
                mode='outlined'
                ref={ref}
                activeOutlineColor={Colors.amber[600]}
                style={[styles.input, style]}
                {...props}
            />
        );
    }
);

const styles = StyleSheet.create({
    input: {
        backgroundColor: Colors.white,
        borderColor: Colors.gray[400],
    },
});

TextInput.displayName = 'TextInput';