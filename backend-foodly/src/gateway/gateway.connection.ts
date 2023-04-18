import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { OnGatewayConnection, OnGatewayInit } from '@nestjs/websockets';
import type { IncomingMessage } from 'http';
import type { AccessTokenPayload } from 'src/auth/interfaces';
import { UserService } from 'src/user/user.service';
import type { WebSocket } from 'ws';
import { Server } from 'ws';

interface CustomWebSocket extends WebSocket {
    request: IncomingMessage;
}

@WebSocketGateway()
export class GatewayConnection implements OnGatewayConnection, OnGatewayInit {
    @WebSocketServer() server: Server;

    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        private userService: UserService,
    ) { }

    public afterInit(server: Server) {
        server.on('connection', (socket: CustomWebSocket, req: IncomingMessage) => {
            // Attach request to client
            socket['request'] = req;
        });
    }

    public async handleConnection(client: any, ...args: IncomingMessage[]) {
        if (args.length && args.length === 0) {
            client.close(1008, 'Unauthorized');

            return null;
        }

        const token = args[0].headers.authorization?.replace('Bearer ', '');

        if (!token) {
            client.send(JSON.stringify({
                event: 'error',
                data: 'Unauthorized',
            }));
            client.close(1008, 'Unauthorized');
            return {
                forbidden: true,
            };
        }

        const decodedToken = await this.verifyToken(token);

        if (!decodedToken) {
            client.close(1008, 'Unauthorized');
            return null;
        }

        // Get user type from token
        const userType = decodedToken.user_type;
        if (userType === 'CUSTOMER') {
            client.send(JSON.stringify({
                event: 'error',
                data: 'Forbidden',
            }));

            client.close(1008, 'Forbidden');
            return null;
        }
    }

    private async verifyToken(accessToken: string) {
        const secretAccessTokenKey = this.configService.get('ACCESS_SECRET_KEY') as string;
        const decodedToken = await this.jwtService.verify<Promise<AccessTokenPayload>>(accessToken, {
            secret: secretAccessTokenKey,
        });
        return decodedToken;
    }


    @SubscribeMessage('take-order')
    public handleMessage(
        @ConnectedSocket() client: CustomWebSocket,
        @MessageBody() body: TakeOrderPayload
    ): string {

        return 'Hello world!';
    }
}

interface TakeOrderPayload {
    order_id: number;
}