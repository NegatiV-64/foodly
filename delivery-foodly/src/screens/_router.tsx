import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './Home.screen';
import { DeliveriesScreen } from './Deliveries.screen';
import { DeliveryScreen } from './Delivery.screen';
import { ProfileScreen } from './Profile.screen';
import { LoginScreen } from './Login.screen';
import type { RootStackParamList, TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();
const TabsNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Deliveries" component={DeliveriesScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

const RootStack = createStackNavigator<RootStackParamList>();
const RootStackNavigator = () => {
    return (
        <RootStack.Navigator>
            <RootStack.Screen name="Login" component={LoginScreen} />
            <RootStack.Screen name="Tabs" component={TabsNavigator} />
            <RootStack.Screen name="Delivery" component={DeliveryScreen} />
        </RootStack.Navigator>
    );
};


export const Router = (): JSX.Element => {
    return (
        <RootStackNavigator />
    );
};