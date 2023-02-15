import type { User } from '@prisma/client';

type UserType = User['user_type'];

export interface AccessTokenPayload {
    user_id: number;
    user_email: string;
    user_fullname: string;
    user_type: UserType;
}

export interface AccessTokenDecoded extends AccessTokenPayload {
    iat: number;
    exp: number;
}