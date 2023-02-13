import type { User } from '@prisma/client';

export interface CreateUserDto {
    email: string;
    phone: string;
    password: string;
    verifyToken: string;
    type: UserType;
}


type UserType = User['user_type'];