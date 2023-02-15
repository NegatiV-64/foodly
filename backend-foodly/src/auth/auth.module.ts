import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from 'src/email/email.module';
import { UserModule } from 'src/user/user.module';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { PassportModule } from '@nestjs/passport';

@Module({
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  imports: [JwtModule, EmailModule, UserModule, PassportModule],
  controllers: [AuthController]
})
export class AuthModule { }
