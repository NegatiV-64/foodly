import { Module } from '@nestjs/common';
import { GatewayConnection } from './gateway.connection';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [JwtModule, UserModule],
    providers: [GatewayConnection],
    exports: [GatewayConnection],
})
export class GatewayModule { }