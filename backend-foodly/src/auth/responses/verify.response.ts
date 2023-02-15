import { ApiProperty } from '@nestjs/swagger';

export class VerifyResponse {
    @ApiProperty()
    message: 'User was verified successfully!';
}