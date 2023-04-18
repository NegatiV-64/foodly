import type { FC } from 'react';
import { Button, Text } from 'react-native';
import type { DeliveriesScreenProps } from './types';
import { Screen } from '../components/utility/Screen';

export const DeliveriesScreen: FC<DeliveriesScreenProps> = ({ navigation }) => {
    return (
        <Screen>
            <Text>
                Deliveries
            </Text>
            <Button
                title='Go to Delivery'
                onPress={() => navigation.navigate('Delivery', {
                    deliveryId: 'some uuid',
                })}
            />
        </Screen>
    );
};