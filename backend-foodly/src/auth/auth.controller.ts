import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/shared/decorators';
import { RefreshTokenGuard } from 'src/shared/guards';
import { AuthService } from './auth.service';
import { RegisterCustomerDto, VerifyUserDto, LoginUserDto } from './dto';
import { LoginResponse, RefreshResponse, RegisterResponse, VerifyResponse } from './responses';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiOperation({
        description: 'Creates a new customer account. After successful registration, an email is sent to the user with a link to verify the account.',
    })
    @ApiCreatedResponse({
        type: RegisterResponse,
        description: 'User was created, now waiting for verification'
    })
    @Post('/register')
    public async registerCustomer(@Body() registerDto: RegisterCustomerDto) {
        await this.authService.registerCustomer(registerDto);

        return {
            email: registerDto.email,
        };
    }

    @ApiOperation({
        description: 'Verifies the user account. After successful verification, the user can log in to the system.',
    })
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

    @ApiOperation({
        description: 'Logs the user into the system. After successful login, a pair of tokens is returned. The access token is used to access the system, and the refresh token is used to get a new pair of tokens.',
    })
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

    @ApiOperation({
        description: 'Refreshes the pair of tokens. After successful refresh, a new pair of tokens is returned. The access token is used to access the system, and the refresh token is used to get a new pair of tokens. Requires refresh token in header.',
    })
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

    @ApiOperation({
        description: 'Logs the employee into the system. After successful login, a pair of tokens is returned. The access token is used to access the system, and the refresh token is used to get a new pair of tokens.',
    })
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: LoginResponse,
        description: 'User was successfully logged'
    })
    @Post('/login/employee')
    public async loginEmployee(@Body() dto: LoginUserDto) {
        const { access_token, refresh_token } = await this.authService.loginUser(dto, 'EMPLOYEE');

        return {
            access_token, refresh_token
        };
    }

}
