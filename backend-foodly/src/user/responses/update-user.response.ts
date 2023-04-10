import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UpdateUserResponse {
    @ApiProperty()
    user_id: number;

    @ApiProperty()
    user_email: string;

    @ApiProperty()
    user_phone: string;

    @ApiProperty({ nullable: true, type: String })
    user_firstname: string | null;

    @ApiProperty({ nullable: true, type: String })
    user_lastname: string | null;

    @ApiProperty({ nullable: true, type: String })
    user_address: string | null;

    @ApiProperty({ enum: UserRole })
    user_type: UserRole | null;

    @ApiProperty()
    user_is_verified: boolean;
}