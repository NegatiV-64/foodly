import { ApiProperty } from '@nestjs/swagger';

export class RefreshResponse {
    @ApiProperty()
    access_token: string;

    @ApiProperty()
    refresh_token: string;
}