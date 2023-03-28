import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ORDER_ERRORS, USER_ERRORS } from 'src/shared/errors';
import type { CreatePaymentDto } from './dto';
import { PAYMENT_ERRORS } from 'src/shared/errors/payment.errors';
import type { GetPaymentsQueryParams, GetPaymentsReturnType } from './interfaces';
import type { GetPaymentResponse } from './responses';

@Injectable()
export class PaymentService {
    constructor(private prisma: PrismaService) { }

    public async createPayment(userId: number, { order_id, payment_user_id, payment_type }: CreatePaymentDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                user_id: userId
            },
            select: {
                user_type: true
            }
        });
        if (user === null) {
            throw new BadRequestException(USER_ERRORS.NOT_FOUND());
        }

        const isUserEmployee = user.user_type !== 'CUSTOMER';

        const order = await this.prisma.order.findUnique({
            where: {
                order_id
            },
            select: {
                order_id: true,
                payment: {
                    select: {
                        payment_id: true
                    }
                }
            }
        });

        if (order === null) {
            throw new BadRequestException(ORDER_ERRORS.NOT_FOUND());
        }

        // Check if the order is already paid
        if (order.payment !== null) {
            throw new BadRequestException(PAYMENT_ERRORS.ALREADY_PAID);
        }

        // Create a new payment and associate it with the order
        const payment = await this.prisma.payment.create({
            data: {
                payment_type: payment_type,
                payment_order_id: order_id,
                payment_user_id: isUserEmployee ? payment_user_id : userId
            }
        });

        return payment;
    }

    public async getPayments(userId: number, { type, created_at, order = 'asc', payer_id, skip, take, order_id, sort = 'payment_date' }: GetPaymentsQueryParams): Promise<GetPaymentsReturnType> {
        const user = await this.prisma.user.findUnique({
            where: {
                user_id: userId
            },
            select: {
                user_type: true
            }
        });
        if (user === null) {
            throw new BadRequestException(USER_ERRORS.NOT_FOUND());
        }

        const isUserEmployee = user.user_type !== 'CUSTOMER';

        const paymentWhere = {
            payment_user_id: isUserEmployee ? payer_id : userId,
            payment_type: type,
            payment_date: created_at,
            order: {
                order_id: order_id
            },
        };

        const [payments, total] = await this.prisma.$transaction([
            this.prisma.payment.findMany({
                where: paymentWhere,
                orderBy: {
                    [sort]: order
                },
                skip: skip,
                take: take,
                select: {
                    payment_id: true,
                    payment_type: true,
                    payment_date: true,
                    payment_order_id: true,
                    payment_user_id: true,
                }
            }),
            this.prisma.payment.count({
                where: paymentWhere
            })
        ]);

        return {
            payments,
            total
        };
    }

    public async getPaymentById(userId: number, paymentId: string): Promise<GetPaymentResponse> {
        // Check if the user exists and is an employee
        const user = await this.prisma.user.findUnique({
            where: {
                user_id: userId
            },
            select: {
                user_type: true
            },
        });
        if (user === null) {
            throw new BadRequestException(USER_ERRORS.NOT_FOUND());
        }
        const isUserEmployee = user.user_type !== 'CUSTOMER';

        const payment = await this.prisma.payment.findFirst({
            where: {
                payment_id: paymentId,
                AND: {
                    payment_user_id: isUserEmployee ? undefined : userId
                }
            },
            select: {
                payment_date: true,
                payment_id: true,
                payment_type: true,
                order: {
                    select: {
                        order_created_at: true,
                        order_id: true,
                        order_price: true,
                        order_status: true,
                    }
                },
            }
        });

        if (payment === null) {
            throw new BadRequestException(PAYMENT_ERRORS.NOT_FOUND());
        }

        return payment;
    }
}
