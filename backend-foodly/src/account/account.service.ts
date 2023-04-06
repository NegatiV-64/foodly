import { BadRequestException, Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { ACCOUNT_ERRORS } from 'src/shared/errors';
import { PrismaService } from 'src/prisma/prisma.service';
import { excludeProperties } from 'src/shared/utils/excludeProperties.util';
import { UserService } from 'src/user/user.service';
import type { UpdateAccountDto } from './dto';

@Injectable()
export class AccountService {
    constructor(private userService: UserService, private prisma: PrismaService) { }

    public async getAccountData(user_id: number) {
        const user = await this.userService.getUserDetails(user_id);
        return user;
    }

    public async updateAccountDate(user_id: number, { user_address, user_email, user_firstname, user_lastname, user_new_password, user_old_password, user_phone }: UpdateAccountDto) {
        const user = await this.userService.findUserById(user_id);

        const updateUserData: UpdateUser = {};

        if (user_new_password && (!user_old_password === true)) {
            throw new BadRequestException(ACCOUNT_ERRORS.ACCOUNT_ERROR_NO_OLD_PASSWORD);
        }

        if (user_old_password && (!user_new_password === true)) {
            throw new BadRequestException(ACCOUNT_ERRORS.ACCOUNT_ERROR_NO_NEW_PASSWORD);
        }

        if (user_new_password && user_old_password) {
            const isOldPasswordValid = await verify(user.user_password, user_old_password);
            if (isOldPasswordValid === false) {
                throw new BadRequestException(ACCOUNT_ERRORS.ACCOUNT_ERROR_WRONG_PASSWORD);
            }

            if (user_new_password === user_old_password) {
                throw new BadRequestException('');
            }

            updateUserData.user_password = await hash(user_new_password);
        }

        if (user_address !== undefined) {
            updateUserData.user_address = user_address;
        }

        if (user_firstname !== undefined) {
            updateUserData.user_firstname = user_firstname;
        }

        if (user_lastname !== undefined) {
            updateUserData.user_lastname = user_lastname;
        }

        if (user_phone !== undefined) {
            updateUserData.user_phone = user_phone;
        }

        if (user_email) {
            updateUserData.user_email = user_email;
        }

        const updatedUser = await this.prisma.user.update({
            where: {
                user_id: user_id,
            },
            data: updateUserData,
        });

        return excludeProperties(updatedUser, 'user_confirm_code', 'user_password', 'user_refresh_token');
    }

    public async deleteAccount(user_id: number) {
        await this.userService.deleteUser(user_id);
    }
}

interface UpdateUser {
    user_email?: string;
    user_phone?: string;
    user_password?: string;
    user_address?: string | null;
    user_firstname?: string | null;
    user_lastname?: string | null;
    user_is_verified?: false;
    user_confirm_code?: string;
}