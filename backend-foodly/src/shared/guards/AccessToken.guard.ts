import { AuthGuard } from '@nestjs/passport';
import { tokenStategies } from 'src/config/token-strategies.config';

export class AccessTokenGuard extends AuthGuard(tokenStategies.accessToken) { }