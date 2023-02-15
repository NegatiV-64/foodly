import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { tokenStategies } from 'src/config/token-strategies.config';
import type { RefreshTokenPayload } from '../interfaces/refresh-token.interface';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, tokenStategies.refreshToken) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('REFRESH_SECRET_KEY'),
            passReqToCallback: true,
        });
    }

    async validate(req: Request, { user_id, user_email }: RefreshTokenPayload) {
        const refreshToken = req.get('authorization')?.replace('Bearer', '').trim();
        if (refreshToken === undefined) {
            throw new UnauthorizedException('Refresh token must be given');
        }

        return { user_id, user_email, refreshToken };
    }
}