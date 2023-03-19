import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UpdateAccountResponse {
    @ApiProperty({ nullable: true })
    user_address: string;

    @ApiProperty()
    user_email: string;

    @ApiProperty({ nullable: true })
    user_firstname: string;

    @ApiProperty()
    user_id: number;

    @ApiProperty()
    user_is_verified: boolean;

    @ApiProperty({ nullable: true })
    user_lastname: string;

    @ApiProperty()
    user_phone: string;

    @ApiProperty({ enum: UserRole })
    user_type: UserRole;
}