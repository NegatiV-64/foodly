import { refreshTokens } from '@/api/auth/refresh-tokens.api';
import type { AccessTokenData, RefreshTokenData } from '@/interfaces/auth.interface';
import type { UserType } from '@/interfaces/user.interface';
import { decodeJwt } from '@/utils/decode-jwt.util';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode, FC } from 'react';

const authContext = createContext<AuthContext>({} as AuthContext);

interface AuthContext {
    user: LoggedUser | null;
    onLogin: (accessToken: string, refreshToken: string) => void;
    onLogout: () => void;
    status: AuthStatus;
}
export const useAuth = () => useContext(authContext);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const { replace } = useRouter();
    const [currentUser, setCurrentUser] = useState<LoggedUser | null>(null);
    const [userStatus, setUserStatus] = useState<AuthStatus>('anonymous');

    function onLogin(accessToken: string, refreshToken: string) {
        // Checking if tokens are valid
        const accessTokenData = decodeJwt<AccessTokenData>(accessToken);
        if (accessTokenData === null) {
            throw new Error('Invalid access token');
        }
        const refreshTokenData = decodeJwt<RefreshTokenData>(refreshToken);
        if (refreshTokenData === null) {
            throw new Error('Invalid refresh token');
        }

        // Setting cookies to store tokens
        setCookie('access_token', accessToken, {
            expires: new Date(accessTokenData.exp * 1000),
        });
        setCookie('refresh_token', refreshToken, {
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
        replace('/');
    }

    function onLogout() {
        setCurrentUser(null);
        setUserStatus('anonymous');
        deleteCookie('access_token');
        deleteCookie('refresh_token');
        replace('/login');
    }

    async function onReload() {
        const accessToken = getCookie('access_token') as string | undefined;
        const refreshToken = getCookie('refresh_token') as string | undefined;

        // If there are no tokens, redirect to login page
        if (accessToken === undefined && refreshToken === undefined) {
            replace('/login');
            return null;
        }

        // If access token is not present and if refresh token is present, then refresh access token
        if (accessToken === undefined && refreshToken !== undefined) {
            const { data, ok } = await refreshTokens(refreshToken);

            if (ok === false || data === null) {
                replace('/login');
                return null;
            }

            const accessTokenData = decodeJwt<AccessTokenData>(data.access_token);
            if (accessTokenData === null) {
                throw new Error('Invalid access token');
            }

            const refreshTokenData = decodeJwt<RefreshTokenData>(data.refresh_token);
            if (refreshTokenData === null) {
                throw new Error('Invalid refresh token');
            }

            // Setting cookies to store tokens
            setCookie('access_token', data.refresh_token, {
                expires: new Date(accessTokenData.exp * 1000),
            });
            setCookie('refresh_token', data.refresh_token, {
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
            replace('/login');
            return null;
        }

        // If both access token and refresh token are present, then check if they are valid
        // If they are valid, then set user data
        if (accessToken !== undefined && refreshToken !== undefined) {
            const accessTokenData = decodeJwt<AccessTokenData>(accessToken);
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

interface AuthProviderProps {
    children: ReactNode;
}

interface LoggedUser {
    user_id: number;
    user_email: string;
    user_fullname: string;
    user_type: UserType;
}

type AuthStatus = 'logged' | 'anonymous';