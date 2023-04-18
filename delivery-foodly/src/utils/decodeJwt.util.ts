import jwt_decode from 'jwt-decode';

export const decodeJwt = <T>(token: string): T | null => {
    if (!token) {
        return null;
    }

    try {
        return jwt_decode(token) as T;
    } catch (error) {
        console.log('Error decoding JWT: ', error);
        return null;
    }
};