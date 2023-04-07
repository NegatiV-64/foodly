import { ServerError } from '@/config/exceptions.config';
import { getCookies, setCookie } from 'cookies-next';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { fetchHandler } from './fetch-handler.util';
import { decodeJwt } from './decode-jwt.util';
import type { AccessTokenData } from '@/interfaces/auth.interface';

export type WithServerSideProps<Props extends GetServerSidePropsGeneric = GetServerSidePropsGeneric> = ReturnType<typeof withServerSideProps<Props>>;


export const withServerSideProps = <Props extends GetServerSidePropsGeneric>(
    getServerSideProps: GetServerSideProps<Props>
) => {
    return async (context: GetServerSidePropsContext) => {
        try {
            const { access_token, refresh_token } = getCookies({
                req: context.req,
                res: context.res,
            });

            if (access_token === undefined && refresh_token === undefined) {
                return {
                    redirect: {
                        destination: '/login',
                        permanent: false,
                    },
                };
            }

            // If access token is expired, but refresh token is not, then refresh the access token
            if (access_token === undefined && refresh_token !== undefined) {
                const response = await fetchHandler<{
                    access_token: string;
                    refresh_token: string;
                }>(
                    '/auth/refresh',
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${refresh_token}`,
                        }
                    },
                    false
                );

                if (response.ok === false || response.data === null) {
                    console.error('Failed to refresh tokens', response.code, response.data, response.error);

                    return {
                        redirect: {
                            destination: '/login',
                            permanent: false,
                        },
                    };
                }

                const { access_token: newAccessToken, refresh_token: newRefreshToken } = response.data;
                const accessTokenData = decodeJwt<AccessTokenData>(newAccessToken);
                if (accessTokenData === null) {
                    throw new ServerError(500, 'Failed to decode access token');
                }
                const refreshTokenData = decodeJwt<AccessTokenData>(newRefreshToken);
                if (refreshTokenData === null) {
                    throw new ServerError(500, 'Failed to decode refresh token');
                }

                setCookie('access_token', newAccessToken, {
                    req: context.req,
                    res: context.res,
                    expires: new Date(accessTokenData.exp * 1000),
                });

                setCookie('refresh_token', newRefreshToken, {
                    req: context.req,
                    res: context.res,
                    expires: new Date(refreshTokenData.exp * 1000),
                });
            }

            return await getServerSideProps(context);
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            const errorCode = getErrorCode(error);
            const errorReason = getErrorReason(error);

            return {
                props: {
                    error: {
                        code: errorCode,
                        message: errorMessage,
                        reason: errorReason,
                    },
                },
            };
        }
    };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GetServerSidePropsGeneric = { [key: string]: any };

function getErrorMessage(error: unknown) {
    let errorMessage = 'An unknown error occurred!';

    if (error instanceof Error) {
        errorMessage = error.message;
    }

    return errorMessage;
}

function getErrorCode(error: unknown) {
    let errorCode = 500;

    if (error instanceof ServerError) {
        errorCode = 500;
    }

    return errorCode;
}

function getErrorReason(error: unknown) {
    let errorReason: null | string = null;

    if (error instanceof ServerError) {
        errorReason = error.reason ?? null;
    }

    return errorReason;
}