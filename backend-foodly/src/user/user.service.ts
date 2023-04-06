import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash, verify } from 'argon2';
import { USER_ERRORS } from 'src/shared/errors';
import type { CreateUserDto, ValidateUser } from './dto';

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

    public async getUserDetails(userId: number) {
        const foundUser = await this.prisma.user.findUnique({
            where: {
                user_id: userId,
            },
            select: {
                delivery: {
                    skip: 0,
                    take: 5,
                },
                feedback: {
                    skip: 0,
                    take: 5,
                },
                order: {
                    skip: 0,
                    take: 5,
                },
                payment: {
                    skip: 0,
                    take: 5,
                },
                user_address: true,
                user_confirm_code: false,
                user_email: true,
                user_firstname: true,
                user_id: true,
                user_is_verified: true,
                user_lastname: true,
                user_password: false,
                user_phone: true,
                user_refresh_token: false,
                user_type: true,
            }
            // include: {
            //     delivery: {
            //         skip: 0,
            //         take: 5,
            //     },
            //     feedback: {
            //         skip: 0,
            //         take: 5,
            //     },
            //     order: {
            //         skip: 0,
            //         take: 5,
            //     },
            //     payment: {
            //         skip: 0,
            //         take: 5,
            //     },
            // }
        });

        if (foundUser === null) {
            throw new NotFoundException(USER_ERRORS.NOT_FOUND('id'));
        }

        return foundUser;
    }

    public async deleteUser(userId: number) {
        await this.prisma.user.delete({
            where: {
                user_id: userId,
            }
        });
    }
}
