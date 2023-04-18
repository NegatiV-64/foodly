import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './Home.screen';
import { DeliveriesScreen } from './Deliveries.screen';
import { DeliveryScreen } from './Delivery.screen';
import { ProfileScreen } from './Profile.screen';
import { LoginScreen } from './Login.screen';
import type { RootStackParamList, TabParamList } from './types';
import { useAuth } from '../contexts/auth';
import { Fragment } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator<TabParamList>();
const TabsNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Deliveries" component={DeliveriesScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

const RootStack = createStackNavigator<RootStackParamList>();
const RootStackNavigator = () => {
    const { status } = useAuth();

    return (
        <RootStack.Navigator>
            {
                status === 'anonymous'
                    ?
                    <RootStack.Screen
                        options={{
                            headerShown: false,
                        }}
                        name="Login"
                        component={LoginScreen}
                    />
                    :
                    <Fragment>
                        <RootStack.Screen
                            options={{
                                headerShown: false,
                            }}
                            name="Tabs"
                            component={TabsNavigator}
                        />
                        <RootStack.Screen name="Delivery" component={DeliveryScreen} />
                    </Fragment>
            }
        </RootStack.Navigator>
    );
};


export const Router = (): JSX.Element => {
    return (
        <SafeAreaProvider>
            <RootStackNavigator />
        </SafeAreaProvider>
    );
};