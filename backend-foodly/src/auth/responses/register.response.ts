import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponse {
    @ApiProperty()
    verification_code: number;

    @ApiProperty()
    email: string;
}