import AsyncStorage from '@react-native-async-storage/async-storage';
import { decodeJwt } from './decodeJwt.util';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../config/auth.config';
import { BACKEND_URL } from '../config/env.config';
import type { RefreshTokenData, AcccessTokenData } from '../types/auth.types';

class FetchError {
    constructor(public code: number, public error: string) { }
}

export const fetchHandler = async <ResponseData = unknown, ResponseError = unknown>(
    url: FetchUrl,
    options?: FetchOptions,
    config?: FetchConfig,
): Promise<FetchHandler<ResponseData, ResponseError>> => {
    const requestUrl = `${BACKEND_URL}${url}`;
    const { isAuth = true, isJson = true } = config || {};

    try {
        // Check if there is a token in the storage
        if (isAuth) {
            const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
            const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);

            // if there is no token, check if there is a refresh token
            if (!accessToken) {
                // if there is no refresh token, throw an error
                if (!refreshToken) {
                    throw new FetchError(401, 'Unauthorized');
                }

                // if there is a refresh token, check if it is expired
                const jwtRefreshData = decodeJwt<RefreshTokenData>(refreshToken);
                if (jwtRefreshData === null) {
                    throw new FetchError(401, 'Jwt parse failed!');
                }

                // if there is a refresh token, try to get a new access token
                // It is written to the storage in the refrehTokenHandler function
                await refrehTokenHandler(refreshToken);
            } else {
                // if there is an access token, check if it is expired
                const jwtAccessData = decodeJwt<AcccessTokenData>(accessToken);
                if (jwtAccessData === null) {
                    throw new FetchError(401, 'Jwt parse failed!');
                }

                const now = new Date().getTime() / 1000;
                // if the access token is expired, check if there is a refresh token
                if (now > jwtAccessData.exp) {
                    // if there is no refresh token, throw an error
                    if (!refreshToken) {
                        throw new FetchError(401, 'Unauthorized');
                    }

                    // if there is a refresh token, check if it is expired
                    const jwtRefreshData = decodeJwt<RefreshTokenData>(refreshToken);
                    if (jwtRefreshData === null) {
                        throw new FetchError(401, 'Jwt parse failed!');
                    }

                    if (now > jwtRefreshData.exp) {
                        // if the refresh token is expired, throw an error
                        throw new FetchError(401, 'Unauthorized');
                    }

                    await refrehTokenHandler(refreshToken);
                }
            }
        }

        const requestConfig = await getRequestConfig(options, isAuth, isJson);

        const rawResponse = await fetch(requestUrl, requestConfig);
        const responseCode = rawResponse.status;
        const responseOk = rawResponse.ok;

        // Check if the response is ok
        if (responseOk === false) {
            const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);

            // If the response is not ok, check if the response code is 401
            if (responseCode === 401 && refreshToken) {
                // Check if the refresh token is expired
                const jwtRefreshData = decodeJwt<RefreshTokenData>(refreshToken);
                if (jwtRefreshData === null) {
                    throw new FetchError(401, 'Jwt parse failed!');
                }

                const now = new Date().getTime() / 1000;
                if (now > jwtRefreshData.exp) {
                    // If the refresh token is expired, throw an error
                    throw new FetchError(401, 'Unauthorized');
                }

                // If the refresh token is not expired, try to get a new access token
                // It is written to the storage in the refrehTokenHandler function
                const { access_token: newAccessToken } = await refrehTokenHandler(refreshToken);

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
                if (!retryRawResponse.ok) {
                    throw new FetchError(retryRawResponse.status, 'Unauthorized');
                }

                // If the retry request is ok, return the response
                const retryRequestData = await retryRawResponse.json() as ResponseData;

                return {
                    code: retryRawResponse.status,
                    data: retryRequestData,
                    error: null,
                    ok: true,
                };
            }

            // If the response is not ok and the response code is not 401, throw an error
            const isValidJson = isJsonString(rawResponse);
            const errorData = await getErrorData(isValidJson, rawResponse);

            throw new FetchError(responseCode, errorData);
        }

        // If the response is ok, return the response
        const requestData = await rawResponse.json() as ResponseData;

        return {
            code: rawResponse.status,
            data: requestData,
            error: null,
            ok: true,
        };
    } catch (error) {
        console.log('Error in fetchHandler: ', error);

        if (error instanceof FetchError) {
            return {
                code: error.code,
                error: JSON.parse(error.error),
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


async function getRequestConfig(options: FetchOptions, hasAuth: boolean, isJSON: boolean) {
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
        const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);

        requestConfig.headers = {
            ...requestConfig.headers,
            'Authorization': `Bearer ${accessToken}`
        };
    }

    return requestConfig;
}

async function refrehTokenHandler(token: string) {
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

    // Write the new access token to the storage
    const jwtAccessData = decodeJwt<AcccessTokenData>(accessToken);
    if (jwtAccessData === null) {
        throw new FetchError(401, 'Jwt parse failed!');
    }
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

    // Write the new refresh token to the storage
    const jwtRefreshData = decodeJwt<RefreshTokenData>(refreshToken);
    if (jwtRefreshData === null) {
        throw new FetchError(401, 'Jwt parse failed!');
    }
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    return responseData as RefreshTokenReturnData;
}

function isJsonString(str: unknown) {
    try {
        JSON.parse(str as string);
    } catch (e) {
        return false;
    }
    return true;
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

type FetchUrl = RequestInfo | URL;
type FetchOptions = (RequestInit & {
    method?: 'POST' | 'GET' | 'PATCH' | 'DELETE' | 'PUT';
}) | undefined;
type FetchConfig = {
    isAuth?: boolean;
    isJson?: boolean;
};

interface FetchHandler<Data = unknown, Error = unknown> {
    code: number;
    ok: boolean;
    data: Data | null;
    error: Error | null;
}

interface RefreshTokenReturnData {
    access_token: string;
    refresh_token: string;
}