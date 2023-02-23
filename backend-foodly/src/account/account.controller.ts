import { Body, Controller, Delete, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/shared/decorators';
import { AccessTokenGuard } from 'src/shared/guards';
import { AccountService } from './account.service';
import { UpdateAccountDto } from './dto/update-account.dto';
import { GetAccountDataResponse } from './responses/getAccountData.response';
import { UpdateAccountResponse } from './responses/updateAccountData.response';

@ApiTags('Account')
@Controller('account')
export class AccountController {
    constructor(private accountService: AccountService) { }

    @ApiOkResponse({
        type: GetAccountDataResponse,
    })
    @UseGuards(AccessTokenGuard)
    @Get()
    public async getAccountData(@GetCurrentUser('user_id') user_id: number) {
        const user = await this.accountService.getAccountData(user_id);

        return user;
    }

    @ApiOkResponse({
        type: UpdateAccountResponse,
    })
    @UseGuards(AccessTokenGuard)
    @Patch()
    public async updateAccountData(@GetCurrentUser('user_id') userId: number, @Body() dto: UpdateAccountDto) {
        const updatedUser = await this.accountService.updateAccountDate(userId, dto);

        return updatedUser;
    }

    @Delete()
    @UseGuards(AccessTokenGuard)
    public async deleteAccount(@GetCurrentUser('user_id') userId: number) {
        await this.accountService.deleteAccount(userId);

        return {
            message: 'Account was deleted successfully'
        };
    }
}
