import type { ComponentPropsWithoutRef, FC } from 'react';
import { Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';

export const Heading: FC<HeadingProps> = ({ children, size = '2xl', style, ...props }) => {
    return (
        <Text
            variant={transformSizeToVariant(size)}
            style={StyleSheet.flatten([styles.heading, style])}
            {...props}
        >
            {children}
        </Text>
    );
};

type HeadingProps = Omit<ComponentPropsWithoutRef<typeof Text>, 'variant'> & {
    size?: 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
};

const styles = StyleSheet.create({
    heading: {
        color: Colors.stone[900],
        fontWeight: '500'
    }
});

function transformSizeToVariant(size?: HeadingProps['size']) {
    let variant: ComponentPropsWithoutRef<typeof Text>['variant'] = 'headlineMedium';

    switch (size) {
        case 'lg':
            variant = 'titleLarge';
            break;
        case 'xl':
            variant = 'headlineSmall';
            break;
        case '2xl':
            variant = 'headlineMedium';
            break;
        case '3xl':
            variant = 'headlineLarge';
            break;
        case '4xl':
            variant = 'titleLarge';
            break;
        case '5xl':
            variant = 'displaySmall';
            break;
        case '6xl':
            variant = 'displayMedium';
            break;
        default:
            variant = 'headlineMedium';
            break;
    }

    return variant;
}