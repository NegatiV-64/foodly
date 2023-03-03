import { AuthGuard } from '@nestjs/passport';
import { tokenStategies } from 'src/shared/config/token-strategies.config';

export class RefreshTokenGuard extends AuthGuard(tokenStategies.refreshToken) { }