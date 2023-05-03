import type { ComponentPropsWithoutRef, FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const Screen: FC<ScreenProps> = ({ hasSafeArea = false, style, children, ...props }) => {
    const insets = useSafeAreaInsets();

    const insetsConfig = {
        top: insets.top,
        bottom: insets.bottom,
        left: insets.left,
        right: insets.right,
    };

    return (
        <View
            style={[styles(hasSafeArea, insetsConfig).screen, style]}
            {...props}
        >
            {children}
        </View>
    );
};

const styles = (hasSafeArea: boolean, { bottom, left, right, top }: ScreenInsetsStyle) => (StyleSheet.create({
    // eslint-disable-next-line react-native/no-unused-styles
    screen: {
        flex: 1,
        paddingTop: hasSafeArea ? top : 0,
        paddingBottom: hasSafeArea ? bottom : 0,
        paddingLeft: hasSafeArea ? left : 0,
        paddingRight: hasSafeArea ? right : 0,
    }
}));

type ScreenProps = ComponentPropsWithoutRef<typeof View> & {
    hasSafeArea?: boolean;
};

interface ScreenInsetsStyle {
    top: number;
    bottom: number;
    left: number;
    right: number;
}