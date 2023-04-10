import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from 'src/shared/guards';
import { GetCurrentUser } from 'src/shared/decorators';
import { ParseOptionalIntPipe, ValidateOrderByQueryPipe } from 'src/shared/pipe';
import { ParseOptionalStringPipe } from 'src/shared/pipe/parse-optional-string.pipe';
import { OrderByQuery } from 'src/shared/interfaces';
import { ParseUserRolePipe } from './pipes/parse-user-role.pipe';
import { UserRole } from '@prisma/client';
import { ParseUserSortPipe } from './pipes/parse-user-sort.pipe';
import { UserSortValue } from './interfaces';
import { GetUsersResponse } from './responses/get-users.response';
import { ApiOkResponse, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetUserResponse } from './responses/get-user.response';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserResponse } from './responses/update-user.response';

@ApiTags('User')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @ApiProperty({
        description: 'Get all users. Only for admins and managers. Access token required.'
    })
    @ApiOkResponse({
        type: GetUsersResponse,
    })
    @ApiQuery({
        name: 'take',
        required: false,
        type: Number,
    })
    @ApiQuery({
        name: 'skip',
        required: false,
        type: Number,
    })
    @ApiQuery({
        name: 'search',
        required: false,
        type: String,
    })
    @ApiQuery({
        name: 'order',
        required: false,
        enum: ['asc', 'desc'],
    })
    @ApiQuery({
        name: 'role',
        required: false,
        enum: Object.values(UserRole).map((role) => role.toLowerCase()),
    })
    @ApiQuery({
        name: 'sort',
        required: false,
        enum: ['user_id', 'user_email', 'user_type', 'user_lastname'],
    })
    @Get()
    @UseGuards(AccessTokenGuard)
    public async getUsers(
        @GetCurrentUser('user_id') userId: number,
        @Query('take', ParseOptionalIntPipe) take?: number,
        @Query('skip', ParseOptionalIntPipe) skip?: number,
        @Query('search', ParseOptionalStringPipe) search?: string,
        @Query('order', ValidateOrderByQueryPipe) order?: OrderByQuery,
        @Query('role', ParseUserRolePipe) role?: UserRole,
        @Query('sort', ParseUserSortPipe) sort?: UserSortValue,
    ): Promise<GetUsersResponse> {
        const { total, users } = await this.userService.getUsers(userId, {
            take,
            skip,
            search,
            order,
            role,
            sort,
        });

        return {
            total,
            users,
        };
    }

    @Get('/:user_id')
    @ApiProperty({
        description: 'Get user by id. Access token required. Only for employees'
    })
    @ApiOkResponse({
        type: GetUserResponse,
    })
    @UseGuards(AccessTokenGuard)
    public async getUserById(
        @GetCurrentUser('user_id') currentUserId: number,
        @Param('user_id', ParseIntPipe) userId: number
    ) {
        const user = await this.userService.getUserById(currentUserId, userId);

        return user;
    }

    @Patch('/:user_id')
    @ApiProperty({
        description: 'Update user by id. Access token required. Only for admins and managers'
    })
    @ApiOkResponse({
        type: UpdateUserResponse,
    })
    @UseGuards(AccessTokenGuard)
    public async updateUserById(
        @GetCurrentUser('user_id') currentUserId: number,
        @Param('user_id', ParseIntPipe) userId: number,
        @Body() body: UpdateUserDto
    ) {
        const user = await this.userService.updateUserById(currentUserId, userId, body);

        return user;
    }
}
