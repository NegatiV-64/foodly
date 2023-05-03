import { Fragment, useCallback } from 'react';
import type { FC } from 'react';
import { StyleSheet, Linking, Pressable, Platform, FlatList, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import type { DeliveryScreenProps } from './types';
import { Screen } from '../components/utility/Screen';
import { useFocusEffect } from '@react-navigation/native';
import { useGetSingleDelivery } from '../api/deliveries/get-single-delivery.api';
import { Loading } from '../components/utility/Loading';
import { Heading } from '../components/ui/Heading';
import { ContentRow } from '../components/ui/ContentRow';
import { Container } from '../components/ui/Container';
import { Time } from '../utils/time.util';
import { ContentColumn } from '../components/ui/ContentColumn';
import { ContentBlock } from '../components/ui/ContentBlock';
import { ContentText } from '../components/ui/ContentText';
import { capitalize } from '../utils/capitalize.util';
import { toCurrency } from '../utils/to-currency.util';
import { BackendImage } from '../components/utility/BackendImage';
import { updateDelivery } from '../api/deliveries/update-delivery.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESS_TOKEN_KEY } from '../config/auth.config';
import type { AcccessTokenData } from '../types/auth.types';
import { decodeJwt } from '../utils/decode-jwt.util';
import { useQueryClient } from '@tanstack/react-query';
import { Colors } from '../styles/colors';
import { ScrollableView } from '../components/utility/ScrollableView';
import { useAuth } from '../contexts/auth';

export const DeliveryScreen: FC<DeliveryScreenProps> = ({
    navigation, route
}) => {
    // ==== Context ==== //
    const { user } = useAuth();

    // ==== Query Client ==== //
    const queryClient = useQueryClient();

    // ==== Router ==== //
    const { deliveryId } = route.params;
    const { setOptions } = navigation;

    // ==== Screen Title ==== //
    const onFocused = useCallback(() => {
        setOptions({
            headerTitle: `Viewing delivery #${deliveryId}`
        });
    }, [setOptions, deliveryId]);
    useFocusEffect(onFocused);

    // ==== Data ==== //
    const { isLoading, isError, data } = useGetSingleDelivery(deliveryId);
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
                    Error while retrieving delivery information
                </Text>
                <Text>
                    {data?.error === 'string' ? data.error : JSON.stringify(data?.error)}
                </Text>
            </Screen>
        );
    }
    const delivery = data.data;

    // ==== Derived data ==== //
    const isDeliveryTakenByUser = delivery.delivery_boy?.user_id === user?.user_id;
    const canDeliveryBeManipulated = delivery.delivery_status === 'PENDING' || delivery.delivery_status === 'ON_WAY';

    // ==== Handlers ==== //
    async function onPhoneCall() {
        if (delivery?.order?.user?.user_phone) {
            const canPhone = await Linking.canOpenURL(`tel:${delivery.order.user.user_phone}`);
            if (!canPhone) {
                return null;
            }
            let url = `tel:${delivery.order.user.user_phone}`;

            if (Platform.OS === 'ios') {
                url = `telprompt:${delivery.order.user.user_phone}`;
            }

            await Linking.openURL(url);
        }
    }

    async function onTakeDelivery() {
        if (delivery.delivery_status !== 'PENDING') {
            return null;
        }

        const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
        if (!token) {
            return null;
        }

        const tokenData = decodeJwt<AcccessTokenData>(token);
        if (tokenData === null) {
            return null;
        }
        const updatedDelivery = await updateDelivery(delivery.delivery_id, {
            delivery_status: 'ON_WAY',
            delivery_boy_id: tokenData.user_id
        });
        if (updatedDelivery.ok === false || updatedDelivery.data === null) {
            return null;
        }

        queryClient.invalidateQueries(['get-delivery', delivery.delivery_id]);
    }

    async function onFinishDelivery() {
        const { data, ok } = await updateDelivery(delivery.delivery_id, {
            delivery_status: 'DONE',
        });

        if (ok === false || data === null) {
            return null;
        }

        queryClient.invalidateQueries(['get-delivery', delivery.delivery_id]);
    }

    return (
        <Screen>
            <ScrollableView>
                <Container style={styles.container}>
                    <View style={styles.header}>
                        <Heading style={styles.title}>
                            Delivery details
                        </Heading>
                        {
                            canDeliveryBeManipulated &&
                            <Fragment>
                                {
                                    isDeliveryTakenByUser !== true
                                        ?
                                        <Button
                                            style={styles.takeButton}
                                            mode='contained'
                                            onPress={onTakeDelivery}
                                        >
                                            Take delivery
                                        </Button>
                                        :
                                        <Button
                                            onPress={onFinishDelivery}
                                            style={styles.finishButton}
                                            mode='contained'
                                        >
                                            Finish delivery
                                        </Button>
                                }
                            </Fragment>
                        }
                    </View>
                    <ContentRow>
                        <ContentColumn>
                            <ContentBlock title={'Date created'}>
                                <ContentText>
                                    {Time(delivery.delivery_created_at).format('DD/MM/YYYY HH:mm')}
                                </ContentText>
                            </ContentBlock>
                            <ContentBlock title={'Date status'}>
                                <ContentText>
                                    {capitalize(delivery.delivery_status)}
                                </ContentText>
                            </ContentBlock>
                        </ContentColumn>
                        <ContentColumn>
                            <ContentBlock title={'Charge'}>
                                <ContentText>
                                    {toCurrency(delivery.delivery_price - (delivery.order?.order_price ?? 0))}
                                </ContentText>
                            </ContentBlock>
                            <ContentBlock title={'Address'}>
                                <ContentText>
                                    {delivery.delivery_address}
                                </ContentText>
                            </ContentBlock>
                        </ContentColumn>
                    </ContentRow>
                    <Heading style={styles.subtitle}>
                        Order details
                    </Heading>
                    {
                        delivery.order !== null
                            ?
                            <Fragment>
                                <ContentRow>
                                    <ContentColumn>
                                        <ContentBlock title={'Created'}>
                                            <ContentText>
                                                {Time(delivery.order.order_created_at).format('DD/MM/YYYY HH:mm')}
                                            </ContentText>
                                        </ContentBlock>
                                        <ContentBlock title={'Status'}>
                                            <ContentText>
                                                {capitalize(delivery.order.order_status)}
                                            </ContentText>
                                        </ContentBlock>
                                    </ContentColumn>
                                    <ContentColumn>
                                        <ContentBlock title={'Payment'}>
                                            <ContentText>
                                                {delivery.order.payment ? `Paid with ${delivery.order.payment.payment_type === 'CASH' ? 'cash' : 'card'}` : 'Not paid'}
                                            </ContentText>
                                        </ContentBlock>
                                        <ContentBlock title={'Price'}>
                                            <ContentText>
                                                {toCurrency(delivery.order.order_price)}
                                            </ContentText>
                                        </ContentBlock>
                                    </ContentColumn>
                                </ContentRow>
                                <ContentRow style={styles.customerRow}>
                                    <ContentColumn>
                                        <ContentBlock title={'Customer Name'}>
                                            <ContentText>
                                                {delivery.order.user?.user_firstname ?? 'No data'} {'\n'}
                                                {delivery.order.user?.user_lastname ?? 'No data'}
                                            </ContentText>
                                        </ContentBlock>
                                    </ContentColumn>
                                    <ContentColumn>
                                        <ContentBlock title={'Contact Phone'}>
                                            <Pressable onPress={onPhoneCall}>
                                                <ContentText>
                                                    {delivery.order.user?.user_phone ?? 'No data'}
                                                </ContentText>
                                            </Pressable>
                                        </ContentBlock>
                                    </ContentColumn>
                                </ContentRow>
                            </Fragment>
                            :
                            <ContentText>
                                No order associated with this delivery. This is an error, please contact the administrator.
                            </ContentText>
                    }
                    <Heading style={styles.subtitle}>
                        Ordered products
                    </Heading>
                    {
                        (delivery.order?.products?.length ?? 0) > 0
                            ?
                            <FlatList
                                scrollEnabled={false}
                                data={delivery.order?.products ?? []}
                                keyExtractor={item => item.product_id}
                                renderItem={({ item: product }) => (
                                    <ContentRow style={styles.product}>
                                        <View>
                                            <BackendImage
                                                source={product.product_image}
                                                style={styles.productImage}
                                            />
                                        </View>
                                        <ContentColumn>
                                            <ContentBlock title={'Product'}>
                                                <ContentText>
                                                    {product.product_name}
                                                </ContentText>
                                            </ContentBlock>
                                            <ContentBlock title={'Quantity'}>
                                                <ContentText>
                                                    {product.amount}
                                                </ContentText>
                                            </ContentBlock>
                                        </ContentColumn>
                                        <ContentColumn>
                                            <ContentBlock title={'Price'}>
                                                <ContentText>
                                                    {toCurrency(product.product_price)}
                                                </ContentText>
                                            </ContentBlock>
                                            <ContentBlock title={'Total'}>
                                                <ContentText>
                                                    {toCurrency(product.product_price * product.amount)}
                                                </ContentText>
                                            </ContentBlock>
                                        </ContentColumn>
                                    </ContentRow>
                                )}
                            />
                            :
                            <ContentText>
                                No products associated with this delivery. This is an error, please contact the administrator.
                            </ContentText>
                    }
                </Container>
            </ScrollableView>
        </Screen >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        color: Colors.stone[900]
    },
    takeButton: {
        backgroundColor: Colors.blue[800],
        justifyContent: 'center',
        alignItems: 'center',
    },
    finishButton: {
        backgroundColor: Colors.green[800],
        justifyContent: 'center',
        alignItems: 'center',
    },
    subtitle: {
        textAlign: 'center',
        marginVertical: 20,
    },
    customerRow: {
        marginTop: 15,
    },
    product: {
        marginBottom: 10,
    },
    productImage: {
        flex: 1,
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: 75,
        height: 75,
        borderRadius: 10,
        resizeMode: 'contain'
    }
});