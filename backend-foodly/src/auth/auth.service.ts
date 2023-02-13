import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { RegisterCustomerDTO } from './dto/register-customer.dto';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';
import { UserService } from 'src/user/user.service';
import { EmailService } from 'src/email/email.service';
import type { VerifyUserDto } from './dto/verify-user.dto';
import { AUTH_ERRORS } from 'src/errors/errors';
import type { VerificationTokenDecoded, VerificationTokenPayload } from './interfaces/verification-token.interface';

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

        const verifyCode = Math.floor(1000 + Math.random() * 9000);
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

        await this.userService.createUser({ email, password, phone, type: 'CUSTOMER', verifyToken: verifyCodeToken });

        await this.emailService.sendEmail(email, verifyCode, verifyCodeExpiry);

        return verifyCode;
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
}
