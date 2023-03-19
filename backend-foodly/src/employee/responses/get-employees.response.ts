import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

class GetEmployeesEmployee {
    @ApiProperty()
    user_id: number;

    @ApiProperty({ enum: UserRole })
    user_type: UserRole;

    @ApiProperty()
    user_email: string;

    @ApiProperty()
    user_phone: string;

    @ApiProperty({ nullable: true })
    user_address: string;

    @ApiProperty({ nullable: true })
    user_firstname: string;

    @ApiProperty({ nullable: true })
    user_lastname: string;

    @ApiProperty()
    user_is_verified: boolean;
}

export class GetEmployeesResponse {
    @ApiProperty({ type: [GetEmployeesEmployee] })
    employees: GetEmployeesEmployee[];

    @ApiProperty()
    total: number;
}

