import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'argon2';
import { USER_ERRORS } from 'src/errors/errors';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async createUser({ email, password, phone, verifyToken, type }: CreateUserDto) {
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

    async findUserByEmail(email: string) {
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

    async verifyUser(email: string) {
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
}
