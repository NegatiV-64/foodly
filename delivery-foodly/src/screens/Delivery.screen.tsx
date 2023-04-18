import type { FC } from 'react';
import { Button, Text } from 'react-native';
import type { DeliveryScreenProps } from './types';
import { Screen } from '../components/utility/Screen';

export const DeliveryScreen:FC<DeliveryScreenProps> = ({
    navigation,
}) => {
    return (
        <Screen hasSafeArea={false}>
            <Text>
                Delivery
            </Text>
            <Button
                title="Go to Deliveries"
                onPress={() => navigation.goBack()}
            />
        </Screen>
    );
};