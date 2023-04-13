import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

// ==== Params List ==== //
export type RootStackParamList = {
    Tabs: undefined;
    Login: undefined;
    Delivery: { deliveryId: string };
};

export type TabParamList = {
    Home: undefined;
    Profile: undefined;
    Deliveries: undefined;
};

// ==== Navigation Props ==== //
export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
export type DeliveryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Delivery'>;

export type HomeScreenNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'Home'>,
    StackNavigationProp<RootStackParamList>
>;

export type ProfileScreenNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'Profile'>,
    StackNavigationProp<RootStackParamList>
>;

export type DeliveriesScreenNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'Deliveries'>,
    StackNavigationProp<RootStackParamList>
>;

// ==== Route Props ==== //

export type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;
export type DeliveryScreenRouteProp = RouteProp<RootStackParamList, 'Delivery'>;

export type HomeScreenRouteProp = RouteProp<TabParamList, 'Home'>;
export type ProfileScreenRouteProp = RouteProp<TabParamList, 'Profile'>;
export type DeliveriesScreenRouteProp = RouteProp<TabParamList, 'Deliveries'>;

// ==== Screens ==== //
export type LoginScreenProps = {
    navigation: LoginScreenNavigationProp;
    route: LoginScreenRouteProp;
};

export type DeliveryScreenProps = {
    navigation: DeliveryScreenNavigationProp;
    route: DeliveryScreenRouteProp;
};

export type HomeScreenProps = {
    navigation: HomeScreenNavigationProp;
    route: HomeScreenRouteProp;
};

export type ProfileScreenProps = {
    navigation: ProfileScreenNavigationProp;
    route: ProfileScreenRouteProp;
};

export type DeliveriesScreenProps = {
    navigation: DeliveriesScreenNavigationProp;
    route: DeliveriesScreenRouteProp;
};