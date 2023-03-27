import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DeliveryStatus } from '@prisma/client';
import { GetCurrentUser } from 'src/shared/decorators';
import { AccessTokenGuard } from 'src/shared/guards';
import { OrderByQuery } from 'src/shared/interfaces';
import { ParseDateStringPipe, ParseOptionalIntPipe, ValidateOrderByQueryPipe } from 'src/shared/pipe';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto, UpdateDeliveryDto } from './dto';
import { GetDeliveriesSortByQueryParam } from './interfaces';
import type { GetDeliveriesQueryParams, GetDeliveriesOfUserQueryParams } from './interfaces';
import { ValidateDeliverySortPipe, ValidateDeliveryStatusPipe } from './pipes';
import { CreateDeliveryResponse, DeleteDeliveryResponse, GetDeliveriesOfUserResponse, GetDeliveriesResponse, GetDeliveryResponse, UpdateDeliveryResponse } from './responses';

@ApiTags('Delivery')
@Controller('deliveries')
export class DeliveryController {
    constructor(private deliveryService: DeliveryService) { }

    @Post()
    @ApiOperation({
        description: 'Creates new delivery. Returns created delivery. Can be created without assigned delivery boy. Only logged in users can create deliveries. Access token is required.',
    })
    @ApiCreatedResponse({
        description: 'Returns created delivery',
        type: CreateDeliveryResponse,
    })
    @UseGuards(AccessTokenGuard)
    public async createDelivery(@Body() dto: CreateDeliveryDto) {
        const delivery = await this.deliveryService.createDelivery(dto);

        return delivery;
    }

    @Get()
    @ApiOperation({
        description: 'Returns all deliveries with/without pagination. Only logged in users can get deliveries. Access token is required. Only employees can get deliveries of other users. Customers can get only their deliveries.',
    })
    @ApiQuery({
        name: 'take',
        required: false,
    })
    @ApiQuery({
        name: 'skip',
        required: false,
    })
    @ApiQuery({
        name: 'order',
        enum: ['asc', 'desc'],
        required: false,
    })
    @ApiQuery({
        name: 'customer_id',
        required: false,
        description: 'Only employees can get deliveries of other users. Customers can get only their deliveries.',
    })
    @ApiQuery({
        name: 'created_at',
        required: false,
        description: 'Date in format DD-MM-YYYY',
    })
    @ApiQuery({
        name: 'status',
        enum: ['on_way', 'done', 'canceled', 'failed', 'pending'],
        required: false,
    })
    @ApiQuery({
        name: 'sort',
        enum: ['delivery_id', 'delivery_created_at', 'delivery_finished_at', 'delivery_price', 'delivery_status'],
        required: false,
    })
    @ApiOkResponse({
        type: GetDeliveriesResponse
    })
    @UseGuards(AccessTokenGuard)
    public async getDeliveries(
        @GetCurrentUser('user_id') userId: number,
        @Query('take', ParseOptionalIntPipe) take?: number,
        @Query('skip', ParseOptionalIntPipe) skip?: number,
        @Query('order', ValidateOrderByQueryPipe) order?: OrderByQuery,
        @Query('customer_id', ParseOptionalIntPipe) customer_id?: number,
        @Query('created_at', ParseDateStringPipe) created_at?: string,
        @Query('status', ValidateDeliveryStatusPipe) status?: DeliveryStatus,
        @Query('sort', ValidateDeliverySortPipe) sort?: GetDeliveriesSortByQueryParam,
    ) {
        const deliveriesQueryParams: GetDeliveriesQueryParams = { created_at, customer_id, order, skip, status, take, sort };

        const { deliveries, total } = await this.deliveryService.getDeliveries(userId, deliveriesQueryParams);

        return {
            deliveries,
            total,
        };
    }

    @Get('user/:delivery_boy_id')
    @ApiOperation({
        description: 'Returns all deliveries of user (delivery boy) with/without pagination. Only logged in users can get deliveries. Access token is required. Only managers and admins can get deliveries of other users. Delivery boys can get only their deliveries.',
    })
    @ApiOkResponse({
        type: GetDeliveriesOfUserResponse,
    })
    @ApiQuery({
        name: 'take',
        required: false,
    })
    @ApiQuery({
        name: 'skip',
        required: false,
    })
    @ApiQuery({
        name: 'order',
        enum: ['asc', 'desc'],
        required: false,
    })
    @ApiQuery({
        name: 'created_at',
        required: false,
        description: 'Date in format DD-MM-YYYY',
    })
    @ApiQuery({
        name: 'status',
        enum: ['on_way', 'done', 'canceled', 'failed', 'pending'],
        required: false,
    })
    @ApiQuery({
        name: 'sort',
        enum: ['delivery_id', 'delivery_created_at', 'delivery_finished_at', 'delivery_price', 'delivery_status'],
        required: false,
    })
    @UseGuards(AccessTokenGuard)
    public async getDeliveriesOfUser(
        @GetCurrentUser('user_id') userId: number,
        @Param('delivery_boy_id', ParseIntPipe) deliveryBoyId: number,
        @Query('take', ParseOptionalIntPipe) take?: number,
        @Query('skip', ParseOptionalIntPipe) skip?: number,
        @Query('order', ValidateOrderByQueryPipe) order?: OrderByQuery,
        @Query('created_at', ParseDateStringPipe) created_at?: string,
        @Query('status', ValidateDeliveryStatusPipe) status?: DeliveryStatus,
        @Query('sort', ValidateDeliverySortPipe) sort?: GetDeliveriesSortByQueryParam,
    ) {
        const deliveriesOfUserQueryParams: GetDeliveriesOfUserQueryParams = { created_at, order, skip, status, take, sort };

        const { deliveries, total } = await this.deliveryService.getDeliveriesOfUser(userId, deliveryBoyId, deliveriesOfUserQueryParams);

        return {
            deliveries,
            total,
        };
    }

    @Get(':delivery_id')
    @ApiOperation({
        description: 'Gets delivery by id. Only logged in users can access the data'
    })
    @ApiOkResponse({
        type: GetDeliveryResponse,
    })
    @UseGuards(AccessTokenGuard)
    public async getDeliveryById(
        @GetCurrentUser('user_id') userId: number,
        @Param('delivery_id') deliveryId: string
    ) {
        const delivery = await this.deliveryService.getDeliveryById(userId, deliveryId);

        return delivery;
    }

    @Patch(':delivery_id')
    @ApiOperation({
        description: 'Updates delivery by id. Returns updated delivery. Only logged in users can update deliveries. Access token is required. Only employees can update deliveries of other users. Customers can update only their deliveries.',
    })
    @ApiOkResponse({
        type: UpdateDeliveryResponse,
    })
    @UseGuards(AccessTokenGuard)
    public async updateDelivery(
        @GetCurrentUser('user_id') userId: number,
        @Param('delivery_id') deliveryId: string,
        @Body() dto: UpdateDeliveryDto,
    ) {
        const delivery = await this.deliveryService.updateDelivery(userId, deliveryId, dto);

        return delivery;
    }

    @Delete(':delivery_id')
    @ApiOperation({
        description: 'Deletes delivery by id. Returns deleted delivery. Only logged in users can delete deliveries. Access token is required. Only employees can delete deliveries of other users. Customers can delete only their deliveries.',
    })
    @ApiOkResponse({
        type: DeleteDeliveryResponse,
    })
    public async deleteDelivery(
        @GetCurrentUser('user_id') userId: number,
        @Param('delivery_id') deliveryId: string,
    ) {
        await this.deliveryService.deleteDelivery(userId, deliveryId);

        return {
            message: 'Delivery deleted successfully',
        };
    }
}
