import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { tokenStategies } from 'src/config/token-strategies.config';
import type { AccessTokenPayload } from '../interfaces/access-token.interface';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, tokenStategies.accessToken) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('ACCESS_SECRET_KEY')
        });
    }

    async validate({ user_email, user_fullname, user_id }: AccessTokenPayload) {
        return { user_email, user_fullname, user_id };
    }
}