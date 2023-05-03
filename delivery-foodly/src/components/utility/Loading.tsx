import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '../../styles/colors';

export const Loading = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={Colors.amber[500]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});