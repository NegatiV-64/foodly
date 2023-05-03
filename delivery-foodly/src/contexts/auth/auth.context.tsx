import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshTokens } from '../../api/auth/refresh-tokens.api';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../../config/auth.config';
import type { AcccessTokenData, RefreshTokenData } from '../../types/auth.types';
import { decodeJwt } from '../../utils/decode-jwt.util';
import * as SplashScreen from 'expo-splash-screen';
import { Colors } from '../../styles/colors';

const authContext = createContext<AuthContext>({} as AuthContext);
export const useAuth = () => useContext(authContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoadingComplete, setLoadingComplete] = useState(false);
    const [user, setUser] = useState<LoggedUser | null>(null);
    const [status, setStatus] = useState<AuthStatus>('anonymous');

    async function onLogin(accessToken: string, refreshToken: string) {
        await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

        const decodedAccessToken = decodeJwt<AcccessTokenData>(accessToken);
        if (decodedAccessToken === null) {
            throw new Error('Invalid access token');
        }

        setUser({
            user_id: decodedAccessToken.user_id,
            user_email: decodedAccessToken.user_email,
            user_fullname: decodedAccessToken.user_fullname,
        });

        setStatus('logged');
    }

    async function onLogout() {
        await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
        await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);

        setUser(null);
        setStatus('anonymous');
    }

    const onRefresh = useCallback(async () => {
        // Show the splash screen
        await SplashScreen.preventAutoHideAsync();

        const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
        const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);

        // If there is no access token and refresh token, the user is anonymous
        if (accessToken === null && refreshToken === null) {
            setStatus('anonymous');
            setUser(null);
            // Hide the splash screen
            await SplashScreen.hideAsync();
            return null;
        }

        // If there is no access token but there is a refresh token, get a new access token and refresh token
        if (accessToken === null && refreshToken !== null) {
            // Check if the refresh token is not expired
            const decodedRefreshToken = decodeJwt<RefreshTokenData>(refreshToken);
            if (decodedRefreshToken === null) {
                setStatus('anonymous');
                setUser(null);
                await SplashScreen.hideAsync();
                return null;
            }
            // Check if the refresh token is not expired
            if (decodedRefreshToken.exp * 1000 < Date.now()) {
                setStatus('anonymous');
                setUser(null);
                await SplashScreen.hideAsync();
                return null;
            }

            // Get a new access token and refresh token
            const { data, ok } = await refreshTokens(refreshToken);

            if (ok === false || data === null) {
                setStatus('anonymous');
                setUser(null);
                await SplashScreen.hideAsync();
                return null;
            }

            // Decode the new access token
            const decodedAccessToken = decodeJwt<AcccessTokenData>(data.access_token);
            if (decodedAccessToken === null) {
                setStatus('anonymous');
                setUser(null);
                await SplashScreen.hideAsync();
                return null;
            }
            // Save the new access token and refresh token
            await AsyncStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
            await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);

            // Set the user
            setUser({
                user_id: decodedAccessToken.user_id,
                user_email: decodedAccessToken.user_email,
                user_fullname: decodedAccessToken.user_fullname,
            });

            setStatus('logged');

            await SplashScreen.hideAsync();
        }

        // If there is an access token but there is no refresh token, the user is anonymous
        if (accessToken !== null && refreshToken === null) {
            await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
            setStatus('anonymous');
            setUser(null);
            await SplashScreen.hideAsync();
            return null;
        }

        // If there is an access token and a refresh token, the user is logged
        if (accessToken !== null && refreshToken !== null) {
            // Check if the access token is not expired
            const decodedAccessToken = decodeJwt<AcccessTokenData>(accessToken);
            if (decodedAccessToken === null) {
                setStatus('anonymous');
                setUser(null);
                await SplashScreen.hideAsync();
                return null;
            }

            // Check if the access token is not expired
            if (decodedAccessToken.exp * 1000 < Date.now()) {
                // If the access token is expired, check if the refresh token is not expired
                const decodedRefreshToken = decodeJwt<AcccessTokenData>(refreshToken);
                if (decodedRefreshToken === null) {
                    setStatus('anonymous');
                    setUser(null);
                    await SplashScreen.hideAsync();
                    return null;
                }

                // Check if the refresh token is not expired
                if (decodedRefreshToken.exp * 1000 < Date.now()) {
                    setStatus('anonymous');
                    setUser(null);
                    await SplashScreen.hideAsync();
                    return null;
                }

                // If refresh token is not expired, get a new access token and refresh token
                const { data, ok } = await refreshTokens(refreshToken);

                if (ok === false || data === null) {
                    setStatus('anonymous');
                    setUser(null);
                    await SplashScreen.hideAsync();
                    return null;
                }

                // Decode the new access token
                const decodedAccessToken = decodeJwt<AcccessTokenData>(data.access_token);
                if (decodedAccessToken === null) {
                    setStatus('anonymous');
                    setUser(null);
                    await SplashScreen.hideAsync();
                    return null;
                }
                // Save the new access token and refresh token
                await AsyncStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
                await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);

                // Set the user
                setUser({
                    user_id: decodedAccessToken.user_id,
                    user_email: decodedAccessToken.user_email,
                    user_fullname: decodedAccessToken.user_fullname,
                });

                setStatus('logged');
                await SplashScreen.hideAsync();

                return null;
            }

            // Check if the refresh token is not expired
            const decodedRefreshToken = decodeJwt<AcccessTokenData>(refreshToken);
            if (decodedRefreshToken === null) {
                setStatus('anonymous');
                setUser(null);
                await SplashScreen.hideAsync();
                return null;
            }
            // Check if the refresh token is not expired
            if (decodedRefreshToken.exp * 1000 < Date.now()) {
                setStatus('anonymous');
                setUser(null);
                await SplashScreen.hideAsync();
                return null;
            }

            // Set the user
            setUser({
                user_id: decodedAccessToken.user_id,
                user_email: decodedAccessToken.user_email,
                user_fullname: decodedAccessToken.user_fullname,
            });

            setStatus('logged');
            await SplashScreen.hideAsync();
        }
    }, []);

    useEffect(() => {
        setLoadingComplete(false);
        SplashScreen.preventAutoHideAsync();
        onRefresh();

        const timer = setTimeout(() => {
            setLoadingComplete(true);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [onRefresh]);

    const contextValue: AuthContext = {
        user,
        status,
        onLogin,
        onLogout,
    };

    if (!isLoadingComplete) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={Colors.amber[600]} />
            </View>
        );
    }

    return (
        <authContext.Provider value={contextValue}>
            {children}
        </authContext.Provider>
    );
};

interface AuthContext {
    user: LoggedUser | null;
    onLogin: (accessToken: string, refreshToken: string) => void;
    onLogout: () => void;
    status: AuthStatus;
}

interface LoggedUser {
    user_id: number;
    user_email: string;
    user_fullname: string;
}

type AuthStatus = 'logged' | 'anonymous';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
});