import { Body, Controller, Delete, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/shared/decorators';
import { AccessTokenGuard } from 'src/shared/guards';
import { AccountService } from './account.service';
import { UpdateAccountDto } from './dto';
import { GetAccountResponse, UpdateAccountResponse, DeleteAccountResponse } from './responses';

@ApiTags('Account')
@Controller('account')
export class AccountController {
    constructor(private accountService: AccountService) { }

    @ApiOperation({
        description: 'Endpoint to get account data. Returns the first 5 deliveries, orders and payments. Requires access token in header.',
    })
    @ApiOkResponse({
        description: 'Returns the account data, first 5 deliveries, orders and payments.',
        type: GetAccountResponse,
    })
    @UseGuards(AccessTokenGuard)
    @Get()
    public async getAccountData(@GetCurrentUser('user_id') user_id: number) {
        const user = await this.accountService.getAccountData(user_id);

        return user;
    }

    @ApiOperation({
        description: 'Endpoint to update account data. Every property in request body is optional. If you change the password, an old and new passwords must be provided. Requires access token in header.',
    })
    @ApiOkResponse({
        type: UpdateAccountResponse,
    })
    @UseGuards(AccessTokenGuard)
    @Patch()
    public async updateAccountData(@GetCurrentUser('user_id') userId: number, @Body() dto: UpdateAccountDto) {
        const updatedUser = await this.accountService.updateAccountDate(userId, dto);

        return updatedUser;
    }

    @ApiOperation({
        description: 'Endpoint to delete account. This action is irreversible. Requires access token in header.',
    })
    @ApiOkResponse({
        type: DeleteAccountResponse,
    })
    @Delete()
    @UseGuards(AccessTokenGuard)
    public async deleteAccount(@GetCurrentUser('user_id') userId: number) {
        await this.accountService.deleteAccount(userId);

        return {
            message: 'Account was deleted successfully'
        };
    }
}
