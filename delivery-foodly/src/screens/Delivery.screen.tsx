import type { FC } from 'react';
import { Button, Text, View } from 'react-native';
import type { DeliveryScreenProps } from './types';

export const DeliveryScreen:FC<DeliveryScreenProps> = ({
    navigation,
}) => {
    return (
        <View>
            <Text>
                Delivery
            </Text>
            <Button
                title="Go to Deliveries"
                onPress={() => navigation.goBack()}
            />
        </View>
    );
};