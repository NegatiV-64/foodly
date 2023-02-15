import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { CreateUserDto } from './dto/create-user.dto';
import { hash, verify } from 'argon2';
import { USER_ERRORS } from 'src/errors/errors';
import type { ValidateUser } from './dto/validate-user.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    public async createUser({ email, password, phone, verifyToken, type }: CreateUserDto) {
        const hashedPassword = await hash(password);

        const newUser = await this.prisma.user.create({
            data: {
                user_email: email,
                user_phone: phone,
                user_password: hashedPassword,
                user_is_verified: false,
                user_confirm_code: verifyToken,
                user_type: type,
            }
        });

        return newUser;
    }

    public async findUserByEmail(email: string) {
        const foundUser = await this.prisma.user.findUnique({
            where: {
                user_email: email,
            },
        });

        if (foundUser === null) {
            throw new NotFoundException(USER_ERRORS.NOT_FOUND('email'));
        }

        return foundUser;
    }

    public async verifyUser(email: string) {
        await this.prisma.user.update({
            where: {
                user_email: email,
            },
            data: {
                user_confirm_code: null,
                user_is_verified: true
            }
        });
    }

    public async validateUser({ email, password }: ValidateUser) {
        const foundUser = await this.findUserByEmail(email);

        const isPasswordValid = await verify(foundUser.user_password, password);

        if (isPasswordValid === false) {
            throw new NotFoundException(USER_ERRORS.WRONG_PASSWORD);
        }

        if (foundUser.user_is_verified === false) {
            throw new ForbiddenException(USER_ERRORS.NOT_VERIFIED);
        }

        return foundUser;
    }

    public async updateUserRefreshToken(email: string, refreshToken: string) {
        const hashedRefreshToken = await hash(refreshToken);

        await this.prisma.user.update({
            where: {
                user_email: email,
            },
            data: {
                user_refresh_token: hashedRefreshToken,
            }
        });
    }

    public async findUserById(userId: number) {
        const foundUser = await this.prisma.user.findUnique({
            where: {
                user_id: userId,
            }
        });

        if (foundUser === null) {
            throw new NotFoundException(USER_ERRORS.NOT_FOUND('id'));
        }

        return foundUser;
    }
}
