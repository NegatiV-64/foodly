import { useAuth } from '@/context/auth/auth.context';
import { useRouter } from 'next/router';
import { Fragment, useEffect } from 'react';
import type { FC, ReactNode } from 'react';
import { RoutesConfig } from '@/config/routes.config';
import { getCookie } from 'cookies-next';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/config/auth.config';

export const Protected: FC<ProtectedProps> = ({ children }) => {
    const accessToken = getCookie(ACCESS_TOKEN_KEY) as string || undefined;
    const refreshToken = getCookie(REFRESH_TOKEN_KEY) as string || undefined;
    const { replace } = useRouter();
    const { status } = useAuth();
    
    useEffect(() => {
        if (status !== 'logged')  {
            if (accessToken === undefined || refreshToken === undefined) {
                replace(RoutesConfig.Login);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);


    return (
        <Fragment>
            {children}
        </Fragment>
    );
};

interface ProtectedProps {
    children: ReactNode;
}