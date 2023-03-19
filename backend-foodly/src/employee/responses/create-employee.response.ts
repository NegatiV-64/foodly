import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeResponse {
    @ApiProperty()
    message: string;
}