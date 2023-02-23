import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { RegisterCustomerDTO } from './dto/register-customer.dto';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';
import { UserService } from 'src/user/user.service';
import { EmailService } from 'src/email/email.service';
import type { VerifyUserDto } from './dto/verify-user.dto';
import { AUTH_ERRORS } from 'src/errors/errors';
import type { VerificationTokenDecoded, VerificationTokenPayload } from './interfaces/verification-token.interface';
import type { LoginUserDto } from './dto/login-user.dto';
import type { AccessTokenPayload } from './interfaces/access-token.interface';
import type { RefreshTokenDecoded, RefreshTokenPayload } from './interfaces/refresh-token.interface';
import { verify } from 'argon2';
import { generateRandomCode } from 'src/shared/utils/generateRandomCode';

@Injectable()
export class AuthService {
    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        private userService: UserService,
        private emailService: EmailService,
    ) { }

    public async registerCustomer(dto: RegisterCustomerDTO) {
        const { email, password, phone } = dto;

        const verifyCode = generateRandomCode();
        const verifyCodeExpiry = dayjs().add(5, 'minute').format('MMM DD, HH:mm');
        const VERIFY_SECRET_KEY = this.configService.get('VERIFY_SECRET_KEY') as string;
        const verifyCodePayload: VerificationTokenPayload = {
            email: email,
            code: verifyCode,
        };

        const verifyCodeToken = await this.jwtService.signAsync(verifyCodePayload, {
            expiresIn: '5m',
            secret: VERIFY_SECRET_KEY,
        });

        await this.emailService.sendEmail(email, verifyCode, verifyCodeExpiry);

        await this.userService.createUser({ email, password, phone, type: 'CUSTOMER', verifyToken: verifyCodeToken });
    }

    public async verifyUser({ email, verification_code }: VerifyUserDto) {
        const userToVerify = await this.userService.findUserByEmail(email);

        const userVeficationToken = userToVerify.user_confirm_code;
        if (userVeficationToken === null) {
            throw new ConflictException(AUTH_ERRORS.VERIFICATION_ERROR_NO_TOKEN);
        }

        const decodedVeficationToken = this.jwtService.decode(userVeficationToken) as VerificationTokenDecoded;
        if (Date.now() >= decodedVeficationToken.exp * 1000) {
            throw new BadRequestException(AUTH_ERRORS.VERIFICATION_ERROR_EXPIRED_TOKEN);
        }
        if (`${decodedVeficationToken.code}` !== verification_code) {
            throw new BadRequestException(AUTH_ERRORS.VERIFICATION_ERROR_WRONG_TOKEN);
        }

        await this.userService.verifyUser(userToVerify.user_email);
    }

    public async loginUser({ email, password }: LoginUserDto) {
        const user = await this.userService.validateUser({ email, password });

        const accessTokenPayload: AccessTokenPayload = {
            user_email: user.user_email,
            user_fullname: `${user.user_firstname ?? ''} ${user.user_lastname ?? ''}`,
            user_id: user.user_id,
            user_type: user.user_type,
        };
        const accessToken = await this.jwtService.signAsync(accessTokenPayload, {
            secret: this.configService.get('ACCESS_SECRET_KEY'),
            expiresIn: this.configService.get('NODE_ENV') === 'production' ? '15m' : '1h'
        });

        const refreshTokenPayload: RefreshTokenPayload = {
            user_email: user.user_email,
            user_id: user.user_id,
        };
        const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
            secret: this.configService.get('REFRESH_SECRET_KEY'),
            expiresIn: '7d'
        });

        await this.userService.updateUserRefreshToken(user.user_email, refreshToken);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    public async refreshToken(userId: number, refreshToken: string) {
        const user = await this.userService.findUserById(userId);

        const decodedRefreshToken = this.jwtService.decode(refreshToken) as RefreshTokenDecoded;
        const refreshTokeExpiryDate = decodedRefreshToken.exp * 1000;
        if (Date.now() >= refreshTokeExpiryDate) {
            throw new BadRequestException(AUTH_ERRORS.REFRESH_ERROR_EXPIRED_TOKEN);
        }
        if (user.user_refresh_token === null) {
            throw new BadRequestException(AUTH_ERRORS.REFRESH_ERROR_NO_TOKEN);
        }
        const isRefreshTokenValid = await verify(user.user_refresh_token, refreshToken);
        if (isRefreshTokenValid === false) {
            throw new UnauthorizedException(AUTH_ERRORS.REFRESH_ERROR_WRONG_TOKEN);
        }

        const accessTokenPayload: AccessTokenPayload = {
            user_email: user.user_email,
            user_fullname: `${user.user_firstname ?? ''} ${user.user_lastname ?? ''}`,
            user_id: user.user_id,
            user_type: user.user_type,
        };
        const accessToken = await this.jwtService.signAsync(accessTokenPayload, {
            secret: this.configService.get('ACCESS_SECRET_KEY'),
            expiresIn: this.configService.get('NODE_ENV') === 'production' ? '15m' : '1h'
        });

        const refreshTokenPayload: RefreshTokenPayload = {
            user_email: user.user_email,
            user_id: user.user_id,
        };
        const newRefreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
            secret: this.configService.get('REFRESH_SECRET_KEY'),
            expiresIn: '7d'
        });

        await this.userService.updateUserRefreshToken(user.user_email, newRefreshToken);

        return {
            access_token: accessToken,
            refresh_token: newRefreshToken,
        };
    }
}
