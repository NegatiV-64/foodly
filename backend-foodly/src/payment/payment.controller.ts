import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaymentType } from '@prisma/client';
import { GetCurrentUser } from 'src/shared/decorators';
import { AccessTokenGuard } from 'src/shared/guards';
import { OrderByQuery } from 'src/shared/interfaces';
import { ParseDateStringPipe, ParseOptionalIntPipe, ValidateOrderByQueryPipe } from 'src/shared/pipe';
import { CreatePaymentDto } from './dto/create-payment.dto';
import type { GetPaymentsQueryParams } from './interfaces';
import { PaymentService } from './payment.service';
import { ValidatePaymentTypePipe } from './pipes';
import { GetPaymentResponse, GetPaymentsResponse } from './responses';
import { ParseOptionalStringPipe } from 'src/shared/pipe/parse-optional-string.pipe';

@Controller('payments')
@ApiTags('Payment')
export class PaymentController {
    constructor(private paymentService: PaymentService) { }

    @Post()
    @UseGuards(AccessTokenGuard)
    public async createPayment(
        @GetCurrentUser('user_id') userId: number,
        @Body() dto: CreatePaymentDto
    ) {
        const payment = await this.paymentService.createPayment(userId, dto);

        return payment;
    }

    @ApiOperation({
        description: 'Get all payments. Only logged in users can access this route. Customers can only get their own payments. Employees can get all payments.'
    })
    @ApiOkResponse({
        type: GetPaymentsResponse
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
        name: 'order',
        required: false,
        enum: ['asc', 'desc'],
    })
    @ApiQuery({
        name: 'created_at',
        required: false,
        type: String,
        description: 'Date string in format DD-MM-YYYY'
    })
    @ApiQuery({
        name: 'type',
        required: false,
        enum: PaymentType,
    })
    @ApiQuery({
        name: 'payer_id',
        required: false,
        type: Number,
    })
    @ApiQuery({
        name: 'order_id',
        required: false,
        type: String,
    })
    @UseGuards(AccessTokenGuard)
    @Get()
    public async getPayments(
        @GetCurrentUser('user_id') userId: number,
        @Query('take', ParseOptionalIntPipe) take?: number,
        @Query('skip', ParseOptionalIntPipe) skip?: number,
        @Query('order', ValidateOrderByQueryPipe) order?: OrderByQuery,
        @Query('created_at', ParseDateStringPipe) created_at?: string,
        @Query('type', ValidatePaymentTypePipe) type?: PaymentType,
        @Query('payer_id', ParseOptionalIntPipe) payer_id?: number,
        @Query('order_id', ParseOptionalStringPipe) order_id?: string,
    ) {
        const paymentsQueryParams: GetPaymentsQueryParams = {
            created_at,
            order,
            order_id,
            payer_id,
            skip,
            take,
            type,
        };

        const { payments, total } = await this.paymentService.getPayments(userId, paymentsQueryParams);

        return {
            payments,
            total
        };
    }

    @Get(':payment_id')
    @ApiOperation({
        description: 'Get payment by id. Only logged in users can access this route. Customers can only get their own payment. Employees can get all payments.'
    })
    @ApiOkResponse({
        type: GetPaymentResponse
    })
    @UseGuards(AccessTokenGuard)
    public async getPaymentById(
        @GetCurrentUser('user_id') userId: number,
        @Param('payment_id') paymentId: string
    ) {
        const payment = await this.paymentService.getPaymentById(userId, paymentId);

        return payment;
    }
}
