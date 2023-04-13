import type { FC } from 'react';
import { Button, Text, View } from 'react-native';
import type { DeliveriesScreenProps } from './types';

export const DeliveriesScreen: FC<DeliveriesScreenProps> = ({ navigation }) => {
    return (
        <View>
            <Text>
                Deliveries
            </Text>
            <Button
                title='Go to Delivery'
                onPress={() => navigation.navigate('Delivery', {
                    deliveryId: 'some uuid',
                })}
            />
        </View>
    );
};