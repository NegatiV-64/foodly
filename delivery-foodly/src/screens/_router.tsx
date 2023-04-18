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
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../styles/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';

const Tab = createBottomTabNavigator<TabParamList>();
const TabsNavigator = () => {
    const { bottom } = useSafeAreaInsets();

    const iconSize = 25;

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    height: 60 + bottom,
                    backgroundColor: Colors.amber[600],
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                },
                tabBarLabelStyle: {
                    marginTop: Platform.OS === 'android' ? -5 : -7,
                    fontSize: 16,
                },
                tabBarInactiveTintColor: Colors.gray[300],
                tabBarActiveTintColor: Colors.white,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon({ color }) {
                        return <MaterialIcons
                            name="home-filled"
                            size={iconSize}
                            color={color}
                        />;
                    }
                }}
            />
            <Tab.Screen
                name="Deliveries"
                component={DeliveriesScreen}
                options={{
                    tabBarIcon({ color }) {
                        return <MaterialIcons
                            name="local-shipping"
                            size={iconSize}
                            color={color}
                        />;
                    }
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon({ color }) {
                        return <MaterialIcons
                            name="person"
                            size={iconSize}
                            color={color}
                        />;
                    }
                }}
            />
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