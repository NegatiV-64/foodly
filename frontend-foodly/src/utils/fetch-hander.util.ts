import { BACKEND_URL, NODE_ENV } from '@/config/env.config';
import type { AcccessTokenData, RefreshTokenData } from '@/types/auth.types';
import type { GetServerSidePropsContext } from 'next';
import { decodeJwt } from './decode-jwt.util';
import { setCookie, getCookie } from 'cookies-next';
import { FetchError } from '@/exceptions/fetch-error.exception';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/config/auth.config';

export const fetchHandler = async <ResponseData = unknown, ResponseError = unknown>(
    url: FetchHandlerUrl,
    options?: FetchHandlerOptions,
    config?: FetchHandlerConfig
): Promise<FetchHandler<ResponseData, ResponseError>> => {
    const { context, isAuth = false, isJson = true } = config || {};

    const requestUrl = `${BACKEND_URL}${url}`;


    try {
        const requestConfig = await getRequestConfig(options, {
            context,
            isAuth,
            isJson,
        });

        const rawResponse = await fetch(requestUrl, requestConfig);
        const responseCode = rawResponse.status;
        const responseOk = rawResponse.ok;

        if (responseOk === false) {
            // Check if the response is 401 and if the user has a refresh token
            const refreshToken = getCookie(REFRESH_TOKEN_KEY, context) as string | undefined;
            if (responseCode === 401 && typeof refreshToken === 'string') {
                // If the user has a refresh token, try to get a new access token
                // If the user has a new access token, retry the request with the new access token
                const { access_token: newAccessToken } = await refrehTokenHandler(refreshToken, context);
                const { headers, ...otherOldRequestConfig } = requestConfig;
                let oldRequestConfigHeaders = headers;

                // If the request has authorization, add the new access token to the request
                if (isAuth) {
                    oldRequestConfigHeaders = {
                        ...oldRequestConfigHeaders,
                        'Authorization': `Bearer ${newAccessToken}`
                    };
                }

                const retryRequestConfig: RequestInit = {
                    ...otherOldRequestConfig,
                    headers: oldRequestConfigHeaders,
                };

                const retryRawResponse = await fetch(requestUrl, retryRequestConfig);

                // If the retry request is not ok, throw an error
                if (retryRawResponse.ok === false) {
                    throw new FetchError(retryRawResponse.status, JSON.stringify((await retryRawResponse.json())));
                }

                const retryRequestData = await retryRawResponse.json() as ResponseData;

                return {
                    code: retryRawResponse.status,
                    data: retryRequestData,
                    error: null,
                    ok: true,
                };
            }

            if (NODE_ENV === 'development') {
                console.log('[FETCH HANDLER ERROR]', rawResponse.url, rawResponse.status, rawResponse.statusText, rawResponse.headers);
            }

            const isValidJson = isJsonString(rawResponse);
            const errorData = await getErrorData(isValidJson, rawResponse);

            throw new FetchError(responseCode, errorData);
        }

        const responseData = await rawResponse.json() as ResponseData;

        return {
            code: responseCode,
            ok: responseOk,
            error: null,
            data: responseData,
        };
    } catch (error) {
        console.log('[FETCH HANDLER ERROR]', error);

        if (error instanceof FetchError) {
            const isValidJson = isJsonString(error.error);

            return {
                code: error.code,
                error: isValidJson ? JSON.parse(error.error) : error.error,
                ok: false,
                data: null,
            };
        }

        return {
            code: 500,
            error: 'Uncatched Server error' as ResponseError,
            ok: false,
            data: null,
        };
    }
};

interface FetchHandler<T = unknown, K = unknown> {
    code: number;
    ok: boolean;
    data: T | null;
    error: K | null;
}

function isJsonString(str: unknown) {
    try {
        JSON.parse(str as string);
    } catch (e) {
        return false;
    }
    return true;
}

async function getRequestConfig(options: FetchHandlerOptions, config: FetchHandlerConfig) {
    const { context, isAuth, isJson } = config;
    let requestConfig: RequestInit = {};

    if (isJson) {
        if (options) {
            const { headers: headerOptions, ...otherOptions } = options;

            requestConfig = {
                headers: {
                    ...headerOptions,
                    'Content-Type': 'application/json'
                },
                ...otherOptions
            };
        } else {
            requestConfig = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        }
    } else {
        requestConfig = {
            ...options,
        };
    }

    if (isAuth) {
        const accessToken = getCookie(ACCESS_TOKEN_KEY, {
            req: context?.req,
            res: context?.res,
        });

        if (typeof accessToken !== 'string') {
            // We need to check if the user has a refresh token
            const refreshToken = getCookie(REFRESH_TOKEN_KEY, {
                req: context?.req,
                res: context?.res,
            });

            if (typeof refreshToken !== 'string') {
                throw new FetchError(401, 'No refresh token found');
            }

            const { access_token: newAccessToken } = await refrehTokenHandler(refreshToken, context);


            requestConfig.headers = {
                ...requestConfig.headers,
                'Authorization': `Bearer ${newAccessToken}`,
            };

            return requestConfig;
        }

        requestConfig.headers = {
            ...requestConfig.headers,
            'Authorization': `Bearer ${accessToken}`
        };
    }

    return requestConfig;
}

async function refrehTokenHandler(token: string, context?: GetServerSidePropsContext) {
    const rawResponse = await fetch(`${BACKEND_URL}/auth/refresh`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (rawResponse.ok === false) {
        throw new FetchError(rawResponse.status, JSON.stringify((await rawResponse.json())));
    }

    const responseData = await rawResponse.json() as RefreshTokenReturnData;
    const { access_token: accessToken, refresh_token: refreshToken } = responseData;

    const jwtAccessData = decodeJwt<AcccessTokenData>(accessToken);

    if (jwtAccessData === null) {
        throw new FetchError(500, 'Jwt parse failed!');
    }
    setCookie(ACCESS_TOKEN_KEY, accessToken, {
        expires: new Date(jwtAccessData.exp * 1000),
        req: context?.req,
        res: context?.res,
    });

    const jwtRefreshData = decodeJwt<RefreshTokenData>(refreshToken);
    if (jwtRefreshData === null) {
        throw new FetchError(500, 'Jwt parse failed!');
    }
    setCookie(REFRESH_TOKEN_KEY, refreshToken, {
        expires: new Date(jwtRefreshData.exp * 1000),
        req: context?.req,
        res: context?.res,
    });

    return responseData as RefreshTokenReturnData;
}

async function getErrorData(isValidJson: boolean, rawResponse: Response) {
    let errorData: string;

    if (isValidJson) {
        errorData = await rawResponse.json();
    }
    else {
        errorData = await rawResponse.text();
    }

    return errorData;
}

type FetchHandlerUrl = RequestInfo | URL;
type FetchHandlerOptions = (RequestInit & {
    method?: 'POST' | 'GET' | 'PATCH' | 'DELETE' | 'PUT';
}) | undefined;

interface FetchHandlerConfig {
    isAuth?: boolean;
    isJson?: boolean;
    context?: GetServerSidePropsContext;
}

interface RefreshTokenReturnData {
    access_token: string;
    refresh_token: string;
}