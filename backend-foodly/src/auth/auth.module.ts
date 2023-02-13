import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from 'src/email/email.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [JwtModule, EmailModule, UserModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule { }
