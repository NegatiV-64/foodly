import type { FC } from 'react';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import type { DeliveriesScreenProps } from './types';
import { Screen } from '../components/utility/Screen';
import { Container } from '../components/ui/Container';
import { Heading } from '../components/ui/Heading';
import { useGetUserDeliveriesQuery } from '../api/deliveries/get-user-deliveries.api';
import { Loading } from '../components/utility/Loading';
import { ContentRow } from '../components/ui/ContentRow';
import { ContentColumn } from '../components/ui/ContentColumn';
import { ContentBlock } from '../components/ui/ContentBlock';
import { Time } from '../utils/time.util';
import { ContentText } from '../components/ui/ContentText';
import { capitalize } from '../utils/capitalize.util';
import { toCurrency } from '../utils/to-currency.util';

export const DeliveriesScreen: FC<DeliveriesScreenProps> = ({ navigation }) => {
    const { data, isError, isLoading } = useGetUserDeliveriesQuery();
    const deliveries = data?.data?.deliveries;

    if (isLoading) {
        return (
            <Screen>
                <Loading />
            </Screen>
        );
    }

    if (isError || data.data === null || data.ok === false || deliveries === null || deliveries === undefined) {
        return (
            <Screen>
                <Container>
                    <Heading>
                        Error happened!
                    </Heading>
                    <Text>
                        {typeof data?.error === 'string' ? data.error : JSON.stringify(data?.error)}
                    </Text>
                </Container>
            </Screen>
        );
    }

    function onDeliveryPress(deliveryId: string) {
        navigation.navigate('Delivery', {
            deliveryId,
        });
    }

    return (
        <Screen>
            <Container style={styles.container}>
                <Heading style={styles.title}>
                    My Deliveries
                </Heading>
                <FlatList
                    data={deliveries}
                    keyExtractor={(item) => item.delivery_id}
                    renderItem={({ item: delivery }) => (
                        <Pressable onPress={onDeliveryPress.bind(null, delivery.delivery_id)}>
                            <ContentRow style={styles.delivery}>
                                <ContentColumn>
                                    <ContentBlock title={'Created at'}>
                                        <ContentText>
                                            {Time(delivery.delivery_created_at).format('DD/MM/YYYY HH:mm')}
                                        </ContentText>
                                    </ContentBlock>
                                    <ContentBlock title={'Status'}>
                                        <ContentText>
                                            {capitalize(delivery.delivery_status)}
                                        </ContentText>
                                    </ContentBlock>
                                </ContentColumn>
                                <ContentColumn>
                                    <ContentBlock title={'Restaurant'}>
                                        <ContentText>
                                            {toCurrency(delivery.delivery_price)}
                                        </ContentText>
                                    </ContentBlock>
                                    <ContentBlock title={'Address'}>
                                        <ContentText>
                                            {delivery.delivery_address}
                                        </ContentText>
                                    </ContentBlock>
                                </ContentColumn>
                            </ContentRow>
                        </Pressable>
                    )}
                />
            </Container>
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
    },
    title: {
        marginBottom: 15,
        textAlign: 'center',
    },
    delivery: {
        marginBottom: 15,
    }
});