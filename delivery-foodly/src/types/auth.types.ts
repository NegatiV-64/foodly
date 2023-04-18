export interface AcccessTokenData {
    user_id: number;
    user_fullname: string;
    user_email: string;
    user_type: string;
    iat: number;
    exp: number;
}

export interface RefreshTokenData {
    user_id: number;
    user_email: string;
    iat: number;
    exp: number;
}