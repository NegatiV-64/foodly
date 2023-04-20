import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/shared/decorators';
import { AccessTokenGuard } from 'src/shared/guards';
import { OrderByQuery } from 'src/shared/interfaces';
import { ParseOptionalIntPipe, ValidateOrderByQueryPipe, ParseDateStringPipe } from 'src/shared/pipe';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';
import type { GetOrdersQueryParams} from './interfaces';
import { orderSortValues, OrderSort } from './interfaces';
import { OrderService } from './order.service';
import { ValidateOrderSortPipe } from './pipes/ValidateOrderSortPipe.pipe';
import { CreateOrderResponse, GetOrderResponse, UpdateOrderStatusResponse } from './responses';
import { OrderStatus } from '@prisma/client';
import { ValidateOrderStatusPipe } from './pipes/ValidateOrderStatus.pipe';
import { ValidateOrderDeliveryPipe } from './pipes/ValidateOrderDelivery.pipe';

@ApiTags('Order')
@Controller('orders')
export class OrderController {
    constructor(private orderService: OrderService) { }

    @Post()
    @ApiOperation({
        description: 'Creates a new order. Access token is required. The order is created with the status "hold". The payment data is not stored here',
    })
    @ApiCreatedResponse({
        description: 'Order created successfully',
        type: CreateOrderResponse,
    })
    @UseGuards(AccessTokenGuard)
    public async createOrder(
        @GetCurrentUser('user_id') userId: number,
        @Body() createOrderDto: CreateOrderDto,
    ) {
        const order = await this.orderService.createOrder(userId, createOrderDto.products);

        return order;
    }

    @Get()
    @ApiOperation({
        description: 'Gets all orders. Access token is required. Only admins, managers and delivery boys can get all orders. Customers can only get their own orders.',
    })
    @ApiOkResponse({
        description: 'Orders fetched successfully',
    })
    @ApiQuery({
        name: 'take',
        required: false,
        type: Number,
    })
    @ApiQuery({
        name: 'skip',
        required: false,
        type: Number,
    })
    @ApiQuery({
        name: 'user',
        required: false,
        description: 'Search for orders by user name. Example: "John Doe"',
        type: String,
    })
    @ApiQuery({
        name: 'created_at',
        required: false,
        description: 'Search for orders by creation date. Format: DD-MM-YYYY. Not implemented yet',
        type: String,
    })
    @ApiQuery({
        name: 'status',
        required: false,
        description: 'Search for orders by status. Example: "hold"',
        enum: OrderStatus,
    })
    @ApiQuery({
        name: 'sort',
        required: false,
        enum: orderSortValues,
    })
    @ApiQuery({
        name: 'order',
        required: false,
        enum: ['asc', 'desc']
    })
    @UseGuards(AccessTokenGuard)
    public async getOrders(
        @GetCurrentUser('user_id') userId: number,
        @Query('take', ParseOptionalIntPipe) take?: number,
        @Query('skip', ParseOptionalIntPipe) skip?: number,
        @Query('user') userSearch?: string,
        @Query('created_at', ParseDateStringPipe) createdAt?: string,
        @Query('sort', ValidateOrderSortPipe) sort?: OrderSort,
        @Query('status', ValidateOrderStatusPipe) status?: OrderStatus,
        @Query('delivery', ValidateOrderDeliveryPipe) hasDelivery?: boolean,
        @Query('order', ValidateOrderByQueryPipe) order?: OrderByQuery,
    ) {
        const queryParams: GetOrdersQueryParams = {
            created: createdAt,
            order,
            skip,
            sort,
            take,
            userSearch,
            status,
            hasDelivery,
        };

        const { orders, total } = await this.orderService.getOrders(userId, queryParams);

        return {
            orders, total
        };
    }

    @Get(':order_id')
    @ApiOperation({
        description: 'Get order data. Access token is required. Only admins, managers and delivery boys can get order of other users. Customers can only get their own orders.'
    })
    @ApiOkResponse({
        description: 'Order fetched successfully',
        type: GetOrderResponse,
    })
    @UseGuards(AccessTokenGuard)
    public async getOrder(
        @GetCurrentUser('user_id') userId: number,
        @Param('order_id') orderId: string,
    ) {
        const order = await this.orderService.getOrder(userId, orderId);

        return order;
    }

    @Delete(':order_id')
    @ApiOperation({
        description: 'Deletes an order. Access token is required. Only admins, managers and delivery boys can delete order of other users. Customers can only delete their own orders.'
    })
    @ApiOkResponse({
        description: 'Order deleted successfully',
    })
    @UseGuards(AccessTokenGuard)
    public async deleteOrder(
        @GetCurrentUser('user_id') userId: number,
        @Param('order_id') orderId: string,
    ) {
        const order = await this.orderService.deleteOrder(userId, orderId);

        return order;
    }

    @Put(':order_id/status')
    @ApiOperation({
        description: 'Updates the order status. Access token is required. Only admins, managers and delivery boys can update order of other users. Customers can only update their own orders.'
    })
    @ApiOkResponse({
        description: 'Order status updated successfully',
        type: UpdateOrderStatusResponse,
    })
    @UseGuards(AccessTokenGuard)
    public async updateOrderStatus(
        @GetCurrentUser('user_id') userId: number,
        @Param('order_id') orderId: string,
        @Body() { status }: UpdateOrderStatusDto,
    ) {
        const order = await this.orderService.updateOrderStatus(userId, orderId, status);

        return order;
    }
}