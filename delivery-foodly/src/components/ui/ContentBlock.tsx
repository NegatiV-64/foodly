import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Heading } from './Heading';
import { Colors } from '../../styles/colors';

export const ContentBlock: FC<ContentBlockProps> = ({ style, children, title, ...props }) => {
    return (
        <View
            style={StyleSheet.flatten([styles.block, style])}
            {...props}
        >
            <Heading
                size="lg"
                style={styles.title}
            >
                {title}:
            </Heading>
            {children}
        </View>
    );
};

type ContentBlockProps = ComponentPropsWithoutRef<typeof View> & {
    title: ReactNode;
};

const styles = StyleSheet.create({
    block: {
        flexDirection: 'column',
        gap: 4,
    },
    title: {
        color: Colors.slate[500],
        fontWeight: '400',
        fontSize: 18,
    }
});