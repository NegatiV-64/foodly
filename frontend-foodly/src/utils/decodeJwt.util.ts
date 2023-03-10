import { checkEnvironment } from '@/utils/checkEnviroment.util';

export const decodeJwt = <TokenData = unknown>(token: string): TokenData | null => {
    if (token === undefined) {
        return null;
    }

    const environment = checkEnvironment();

    if (environment === 'server') {
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()) as TokenData;
    }

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const jsonPayload = decodeURIComponent(window.atob(base64)
        .split('')
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join('')
    );

    return JSON.parse(jsonPayload) as TokenData;
};