import { BACKEND_URL, NODE_ENV } from '@/config/env.config';
import type { AcccessTokenData, RefreshTokenData } from '@/interfaces/auth.interface';
import type { GetServerSidePropsContext } from 'next';
import { decodeJwt } from './decodeJwt.util';
import { setCookie, getCookie } from 'cookies-next';

export const fetchHandler = async <ResponseData = unknown, ResponseError = unknown>(
    url: FetchUrl,
    options?: FetchOptions,
    hasAuth = false,
    isJson = true,
    context?: GetServerSidePropsContext,
): Promise<FetchHandler<ResponseData, ResponseError>> => {
    const requestUrl = `${BACKEND_URL}${url}`;
    const requestConfig = getRequestConfig(options, hasAuth, isJson, context);

    try {
        const rawResponse = await fetch(requestUrl, requestConfig);
        const responseCode = rawResponse.status;
        const responseOk = rawResponse.ok;

        if (responseOk === false) {
            // Check if the response is 401 and if the user has a refresh token
            const refreshToken = getCookie('refresh_token', context) as string | undefined;
            if (responseCode === 401 && typeof refreshToken === 'string') {
                // If the user has a refresh token, try to get a new access token
                // If the user has a new access token, retry the request with the new access token
                const { access_token: newAccessToken } = await refrehTokenHandler(refreshToken, context);
                const { headers, ...otherOldRequestConfig } = requestConfig;
                let oldRequestConfigHeaders = headers;

                // If the request has authorization, add the new access token to the request
                if (hasAuth) {
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
                console.log(requestUrl);
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
        if (error instanceof FetchError) {
            return {
                code: error.code,
                error: JSON.parse(error.error) as ResponseError,
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

type FetchUrl = RequestInfo | URL;
type FetchOptions = (RequestInit & {
    method?: 'POST' | 'GET' | 'PATCH' | 'DELETE' | 'PUT';
}) | undefined;

class FetchError {
    constructor(public code: number, public error: string) { }
}

function isJsonString(str: unknown) {
    try {
        JSON.parse(str as string);
    } catch (e) {
        return false;
    }
    return true;
}

function getRequestConfig(options: FetchOptions, hasAuth: boolean, isJSON: boolean, context: GetServerSidePropsContext | undefined) {
    let requestConfig: RequestInit = {};

    if (isJSON) {
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

    if (hasAuth) {
        const accessToken = getCookie('access_token', context);

        requestConfig.headers = {
            ...requestConfig.headers,
            'Authorization': `Bearer ${accessToken}`
        };
    }

    return requestConfig;
}


async function refrehTokenHandler(token: string, context?: GetServerSidePropsContext) {
    const rawResponse = await fetch(`${BACKEND_URL}/auth/refresh`, {
        method: 'POST',
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
        throw new FetchError(401, 'Jwt parse failed!');
    }
    setCookie('access_token', accessToken, {
        expires: new Date(jwtAccessData.exp * 1000),
        req: context?.req,
        res: context?.res,
    });

    const jwtRefreshData = decodeJwt<RefreshTokenData>(refreshToken);

    if (jwtRefreshData === null) {
        throw new FetchError(401, 'Jwt parse failed!');
    }
    setCookie('refreshToken', refreshToken, {
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

interface RefreshTokenReturnData {
    access_token: string;
    refresh_token: string;
}