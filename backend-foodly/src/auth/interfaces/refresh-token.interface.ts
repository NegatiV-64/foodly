export interface RefreshTokenPayload {
    user_id: number;
    user_email: string;
}

export interface RefreshTokenDecoded extends RefreshTokenPayload {
    iat: number;
    exp: number;
}