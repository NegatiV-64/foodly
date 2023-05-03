import type { FC } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Screen } from '../components/utility/Screen';
import { useGetOrders } from '../api/deliveries/get-deliveries.api';
import { Loading } from '../components/utility/Loading';
import { Colors } from '../styles/colors';
import { Container } from '../components/ui/Container';
import { Time } from '../utils/time.util';
import type { HomeScreenProps } from './types';

export const HomeScreen: FC<HomeScreenProps> = ({ navigation }) => {
    const { data, isLoading, isError, } = useGetOrders();

    if (isLoading) {
        return (
            <Screen>
                <Loading />
            </Screen>
        );
    }

    if (isError || data.data === null || data.ok === false) {
        return (
            <Screen>
                <Text>
                    Error
                </Text>
            </Screen>
        );
    }

    const onDeliveryPressHandler = (deliveryId: string) => {
        navigation.navigate('Delivery', {
            deliveryId,
        });
    };

    return (
        <Screen>
            <Container style={styles.container}>
                <Text
                    variant='headlineMedium'
                >
                    Pending Deliveries
                </Text>
                <FlatList
                    data={data.data.deliveries}
                    keyExtractor={(item) => item.delivery_id}
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={onDeliveryPressHandler.bind(null, item.delivery_id)}
                            style={styles.order}
                        >
                            <View style={styles.orderCell}>
                                <Text variant='titleMedium' style={styles.orderTitle}>
                                    Date:
                                </Text>
                                <Text>
                                    {Time(item.delivery_created_at).format('DD/MM/YYYY HH:mm')}
                                </Text>
                            </View>
                            <View style={styles.orderCell}>
                                <Text variant='titleMedium' style={styles.orderTitle}>
                                    Price:
                                </Text>
                                <Text>
                                    {item.delivery_price}
                                </Text>
                            </View>
                            <View style={styles.orderCell}>
                                <Text variant='titleMedium' style={styles.orderTitle}>
                                    Address:
                                </Text>
                                <Text>
                                    {item.delivery_address}
                                </Text>
                            </View>
                        </Pressable>
                    )}
                >
                </FlatList>
            </Container>
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        backgroundColor: Colors.gray[50],
        flex: 1,
    },
    order: {
        marginTop: 8,
        backgroundColor: Colors.white,
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    orderCell: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderTitle: {
        fontWeight: '500',
    }
});