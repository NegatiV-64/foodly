import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterCustomerDTO } from './dto/register-customer.dto';
import { VerifyUserDto } from './dto/verify-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    @Post('/register')
    public async registerCustomer(@Body() registerDto: RegisterCustomerDTO) {
        const verificationCode = await this.authService.registerCustomer(registerDto);

        return {
            verification_code: verificationCode,
            email: registerDto.email,
        };
    }

    @Post('/verify')
    public async verifyUser(@Body() dto: VerifyUserDto) {
        await this.authService.verifyUser(dto);

        return {
            message: 'User was verified successfully!'
        };
    }
}
