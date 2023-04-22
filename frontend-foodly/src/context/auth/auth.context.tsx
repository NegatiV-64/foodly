import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import type { FC, ReactNode } from 'react';
import { decodeJwt } from '@/utils/decode-jwt.util';
import type { AcccessTokenData, RefreshTokenData } from '@/types/auth.types';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import type { UserType } from '@/types/user.types';
import { RoutesConfig } from '@/config/routes.config';
import { authRefresh } from '@/api/auth/refresh.api';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/config/auth.config';

const authContext = createContext<AuthContext>({} as AuthContext);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const { replace } = useRouter();
    const [currentUser, setCurrentUser] = useState<LoggedUser | null>(null);
    const [userStatus, setUserStatus] = useState<AuthStatus>('anonymous');

    function onLogin(accessToken: string, refreshToken: string) {
        // Checking if tokens are valid
        const accessTokenData = decodeJwt<AcccessTokenData>(accessToken);
        if (accessTokenData === null) {
            throw new Error('Invalid access token');
        }
        const refreshTokenData = decodeJwt<RefreshTokenData>(refreshToken);
        if (refreshTokenData === null) {
            throw new Error('Invalid refresh token');
        }

        // Setting cookies to store tokens
        setCookie(ACCESS_TOKEN_KEY, accessToken, {
            expires: new Date(accessTokenData.exp * 1000),
        });
        setCookie(REFRESH_TOKEN_KEY, refreshToken, {
            expires: new Date(refreshTokenData.exp * 1000),
        });

        // Setting user data
        setCurrentUser({
            user_id: accessTokenData.user_id,
            user_email: accessTokenData.user_email,
            user_fullname: accessTokenData.user_fullname,
            user_type: accessTokenData.user_type,
        });
        setUserStatus('logged');

        // Redirecting to home page
        replace(RoutesConfig.Home);
    }

    function onLogout() {
        setCurrentUser(null);
        setUserStatus('anonymous');
        deleteCookie(ACCESS_TOKEN_KEY);
        deleteCookie(REFRESH_TOKEN_KEY);
        replace(RoutesConfig.Login);
    }

    async function onReload() {
        const accessToken = getCookie(ACCESS_TOKEN_KEY) as string | undefined;
        const refreshToken = getCookie(REFRESH_TOKEN_KEY) as string | undefined;

        // If there are no tokens, redirect to login page
        if (accessToken === undefined && refreshToken === undefined) {
            return null;
        }

        // If access token is not present and if refresh token is present, then refresh access token
        if (accessToken === undefined && refreshToken !== undefined) {
            const { data, ok } = await authRefresh(refreshToken);

            if (ok === false || data === null) {
                replace(RoutesConfig.Login);
                return null;
            }

            const accessTokenData = decodeJwt<AcccessTokenData>(data.access_token);
            if (accessTokenData === null) {
                throw new Error('Invalid access token');
            }

            const refreshTokenData = decodeJwt<RefreshTokenData>(data.refresh_token);
            if (refreshTokenData === null) {
                throw new Error('Invalid refresh token');
            }

            // Setting cookies to store tokens
            setCookie(ACCESS_TOKEN_KEY, data.refresh_token, {
                expires: new Date(accessTokenData.exp * 1000),
            });
            setCookie(REFRESH_TOKEN_KEY, data.refresh_token, {
                expires: new Date(refreshTokenData.exp * 1000),
            });

            // Setting user data
            setCurrentUser({
                user_id: accessTokenData.user_id,
                user_email: accessTokenData.user_email,
                user_fullname: accessTokenData.user_fullname,
                user_type: accessTokenData.user_type,
            });
            setUserStatus('logged');
        }

        // If access token is present and if refresh token is not present, then redirect to login page
        if (accessToken !== undefined && refreshToken === undefined) {
            replace(RoutesConfig.Login);
            return null;
        }

        // If both access token and refresh token are present, then check if they are valid
        // If they are valid, then set user data
        if (accessToken !== undefined && refreshToken !== undefined) {
            const accessTokenData = decodeJwt<AcccessTokenData>(accessToken);
            if (accessTokenData === null) {
                throw new Error('Invalid access token');
            }

            // Setting user data
            setCurrentUser({
                user_id: accessTokenData.user_id,
                user_email: accessTokenData.user_email,
                user_fullname: accessTokenData.user_fullname,
                user_type: accessTokenData.user_type,
            });
            setUserStatus('logged');
        }
    }

    useEffect(() => {
        onReload();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const contextValue: AuthContext = {
        user: currentUser,
        status: userStatus,
        onLogin,
        onLogout,
    };

    return (
        <authContext.Provider value={contextValue}>
            {children}
        </authContext.Provider>
    );
};

export const useAuth = () => useContext(authContext);

interface AuthProviderProps {
    children: ReactNode;
}

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
    user_type: UserType;
}

type AuthStatus = 'logged' | 'anonymous';