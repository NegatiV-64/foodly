import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/shared/decorators';
import { RefreshTokenGuard } from 'src/shared/guards';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterCustomerDTO } from './dto/register-customer.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { LoginResponse, RefreshResponse, RegisterResponse, VerifyResponse } from './responses';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiCreatedResponse({
        type: RegisterResponse,
        description: 'User was created, now waiting for verification'
    })
    @Post('/register')
    public async registerCustomer(@Body() registerDto: RegisterCustomerDTO) {
        await this.authService.registerCustomer(registerDto);

        return {
            email: registerDto.email,
        };
    }

    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: VerifyResponse,
        description: 'User was verified successfully'
    })
    @Post('/verify')
    public async verifyUser(@Body() dto: VerifyUserDto) {
        await this.authService.verifyUser(dto);

        return {
            message: 'User was verified successfully!'
        };
    }

    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: LoginResponse,
        description: 'User was successfully logged'
    })
    @Post('/login')
    public async loginUser(@Body() dto: LoginUserDto) {
        const { access_token, refresh_token } = await this.authService.loginUser(dto);

        return {
            access_token, refresh_token
        };
    }

    @UseGuards(RefreshTokenGuard)
    @ApiOkResponse({
        type: RefreshResponse,
        description: 'A new pair of tokens was given'
    })
    @Get('/refresh')
    public async refreshToken(@GetCurrentUser() user: { user_id: number; refreshToken: string }) {
        const { access_token, refresh_token } = await this.authService.refreshToken(user.user_id, user.refreshToken);

        return {
            access_token, refresh_token
        };
    }
}
