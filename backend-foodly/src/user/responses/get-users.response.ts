import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

class GetUsersUser {
    @ApiProperty()
    user_id: number;

    @ApiProperty()
    user_email: string;

    @ApiProperty()
    user_phone: string;

    @ApiProperty({ enum: UserRole })
    user_type: UserRole;

    @ApiProperty({ nullable: true, type: String })
    user_firstname: string | null;

    @ApiProperty({ nullable: true, type: String })
    user_lastname: string | null;

    @ApiProperty()
    user_is_verified: boolean;

    @ApiProperty({ nullable: true, type: String })
    user_address: string | null;
}

export class GetUsersResponse {
    @ApiProperty({ type: [GetUsersUser] })
    users: GetUsersUser[];

    @ApiProperty()
    total: number;
}