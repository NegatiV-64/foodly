import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { Order, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DELIVERY_ERRORS, ORDER_ERRORS, USER_ERRORS } from 'src/shared/errors';
import { dayjs } from 'src/shared/libs/dayjs.lib';
import type { CreateDeliveryDto, UpdateDeliveryDto } from './dto';
import type { GetDeliveriesOfUserQueryParams, GetDeliveriesQueryParams, GetDeliveryByIdReturnType, UpdateDeliveryByIdReturnType } from './interfaces';

@Injectable()
export class DeliveryService {
    constructor(private prisma: PrismaService) { }

    public async createDelivery({ delivery_address, delivery_charge, order_id }: CreateDeliveryDto) {
        // Check if order exists
        const order = await this.prisma.order.findUnique({
            where: {
                order_id: order_id
            }
        });

        if (order === null) {
            throw new NotFoundException(ORDER_ERRORS.NOT_FOUND(order_id));
        }

        const delivery = await this.prisma.delivery.create({
            data: {
                delivery_address: delivery_address,
                delivery_order_id: order_id,
                delivery_price: +order.order_price + delivery_charge,
                delivery_status: 'PENDING',
            }
        });

        return delivery;
    }

    public async getDeliveries(
        userId: number,
        { created_at, customer_id, order = 'desc', skip, status, take, sort = 'delivery_created_at' }: GetDeliveriesQueryParams
    ) {
        const user = await this.prisma.user.findUnique({
            where: {
                user_id: userId
            }
        });
        if (user === null) {
            throw new NotFoundException(USER_ERRORS.NOT_FOUND('user_id'));
        }

        const isUserEmployee = user.user_type !== 'CUSTOMER';

        const [deliveries, total] = await this.prisma.$transaction([
            this.prisma.delivery.findMany({
                where: {
                    delivery_created_at: {
                        gte: created_at ? new Date(created_at) : undefined,
                    },
                    delivery_status: status,
                    Order: {
                        order_user_id: isUserEmployee ? customer_id : userId,
                    }
                },
                orderBy: {
                    [sort]: order,
                },
                include: {
                    delivery_boy: {
                        select: {
                            user_id: true,
                            user_firstname: true,
                            user_lastname: true,
                            user_phone: true,
                        }
                    },
                },
                skip: skip,
                take: take,
            }),
            this.prisma.delivery.count({
                where: {
                    delivery_created_at: {
                        gte: created_at ? dayjs(created_at).startOf('day').toDate() : undefined,
                    },
                    delivery_status: status,
                    Order: {
                        order_user_id: isUserEmployee ? customer_id : userId,
                    }
                },
            })

        ]);

        return {
            deliveries,
            total,
        };
    }

    public async getDeliveriesOfUser(userId: number, deliveryBoyId: number, { created_at, order = 'desc', skip, status, take, sort = 'delivery_created_at' }: GetDeliveriesOfUserQueryParams) {
        const user = await this.prisma.user.findUnique({
            where: {
                user_id: userId
            }
        });
        if (user === null) {
            throw new NotFoundException(USER_ERRORS.NOT_FOUND('user_id'));
        }

        const isUserDeliveryBoy = user.user_type === 'DELIVERY_BOY';

        const whereInput: Prisma.DeliveryWhereInput = {
            delivery_boy_id: isUserDeliveryBoy ? userId : deliveryBoyId,
            delivery_created_at: {
                gte: created_at ? new Date(dayjs(created_at, 'DD-MM-YYYY').format('YYYY-MM-DD')) : undefined,
            },
            delivery_status: status,
        };

        const [deliveries, total] = await this.prisma.$transaction([
            this.prisma.delivery.findMany({
                where: whereInput,
                orderBy: {
                    [sort]: order,
                },
                select: {
                    delivery_address: true,
                    delivery_boy: {
                        select: {
                            user_id: true,
                            user_firstname: true,
                            user_lastname: true,
                            user_phone: true,
                        }
                    },
                    delivery_created_at: true,
                    delivery_finished_at: true,
                    delivery_id: true,
                    delivery_order_id: true,
                    delivery_price: true,
                    delivery_status: true,
                },
                skip: skip,
                take: take,
            }),
            this.prisma.delivery.count({
                where: whereInput,
            })
        ]);

        return {
            deliveries,
            total,
        };
    }

    public async getDeliveryById(userId: number, deliveryId: string): Promise<GetDeliveryByIdReturnType> {
        const user = await this.prisma.user.findUnique({
            where: {
                user_id: userId
            }
        });
        if (user === null) {
            throw new NotFoundException(USER_ERRORS.NOT_FOUND('user_id'));
        }
        const isUserEmployee = user.user_type !== 'CUSTOMER';

        const dbDelivery = await this.prisma.delivery.findFirst({
            where: {
                delivery_id: deliveryId,
                AND: {
                    Order: {
                        order_user_id: isUserEmployee ? undefined : userId,
                    }
                }
            },
            select: {
                delivery_address: true,
                delivery_boy: {
                    select: {
                        user_id: true,
                        user_firstname: true,
                        user_lastname: true,
                        user_phone: true,
                    }
                },
                delivery_created_at: true,
                delivery_finished_at: true,
                delivery_id: true,
                delivery_price: true,
                delivery_status: true,
                Order: {
                    select: {
                        order_created_at: true,
                        order_id: true,
                        order_price: true,
                        order_status: true,
                        payment: {
                            select: {
                                payment_date: true,
                                payment_id: true,
                                payment_type: true,
                            }
                        },
                        products: {
                            select: {
                                amount: true,
                                product: {
                                    select: {
                                        product_id: true,
                                        product_name: true,
                                        product_description: true,
                                        product_image: true,
                                        product_price: true,
                                    }
                                }
                            }
                        },
                        user: {
                            select: {
                                user_address: true,
                                user_email: true,
                                user_lastname: true,
                                user_firstname: true,
                                user_id: true,
                                user_phone: true,
                                user_type: true,
                            }
                        }
                    }
                }
            }
        });

        if (dbDelivery === null) {
            throw new NotFoundException(DELIVERY_ERRORS.NOT_FOUND(deliveryId));
        }

        const delivery: GetDeliveryByIdReturnType = {
            delivery_address: dbDelivery.delivery_address,
            delivery_boy: dbDelivery.delivery_boy,
            delivery_created_at: dbDelivery.delivery_created_at,
            delivery_finished_at: dbDelivery.delivery_finished_at,
            delivery_id: dbDelivery.delivery_id,
            delivery_price: dbDelivery.delivery_price,
            delivery_status: dbDelivery.delivery_status,
            order: dbDelivery.Order ? {
                order_created_at: dbDelivery.Order.order_created_at,
                order_id: dbDelivery.Order.order_id,
                order_price: dbDelivery.Order.order_price,
                order_status: dbDelivery.Order.order_status,
                payment: dbDelivery.Order.payment ? {
                    payment_date: dbDelivery.Order.payment.payment_date,
                    payment_id: dbDelivery.Order.payment.payment_id,
                    payment_type: dbDelivery.Order.payment.payment_type,
                } : null,
                products: dbDelivery.Order.products.map(product => {
                    return {
                        amount: product.amount,
                        product_description: product.product.product_description,
                        product_id: product.product.product_id,
                        product_image: product.product.product_image,
                        product_name: product.product.product_name,
                        product_price: product.product.product_price,
                    };
                }),
                user: {
                    user_address: dbDelivery.Order.user.user_address,
                    user_email: dbDelivery.Order.user.user_email,
                    user_firstname: dbDelivery.Order.user.user_firstname,
                    user_id: dbDelivery.Order.user.user_id,
                    user_lastname: dbDelivery.Order.user.user_lastname,
                    user_phone: dbDelivery.Order.user.user_phone,
                    user_type: dbDelivery.Order.user.user_type,
                }
            } : null
        };

        return delivery;
    }

    public async updateDelivery(userId: number, deliveryId: string, { delivery_address, delivery_boy_id, delivery_charge, delivery_finished_at, delivery_status, order_id }: UpdateDeliveryDto): Promise<UpdateDeliveryByIdReturnType> {
        // Cheсk if user exists and check if user is employee
        const user = await this.prisma.user.findUnique({
            where: {
                user_id: userId
            }
        });
        if (user === null) {
            throw new NotFoundException(USER_ERRORS.NOT_FOUND('user_id'));
        }

        // Check if user is employee and if the user is admin or manager
        const isUserEmployee = user.user_type !== 'CUSTOMER';
        const isUserAdminOrManager = user.user_type === 'ADMIN' || user.user_type === 'MANAGER';

        // Check if delivery exists
        const dbDelivery = await this.prisma.delivery.findFirst({
            where: {
                delivery_id: deliveryId,
                AND: {
                    Order: {
                        order_user_id: isUserEmployee ? undefined : userId,
                    }
                }
            },
            include: {
                Order: {
                    select: {
                        order_price: true,
                    }
                }
            }
        });
        if (dbDelivery === null) {
            throw new NotFoundException(DELIVERY_ERRORS.NOT_FOUND(deliveryId));
        }

        // Check if delivery is not done
        if (dbDelivery.delivery_status === 'DONE') {
            throw new BadRequestException(DELIVERY_ERRORS.FINISHED_DELIVERY);
        }

        // If a new order is assigned, then check if the order exists
        let newAssignedOrder: Order | null = null;
        if (order_id !== undefined) {
            const dbOrder = await this.prisma.order.findUnique({
                where: {
                    order_id: order_id,
                },
            });

            if (dbOrder === null) {
                throw new NotFoundException(ORDER_ERRORS.NOT_FOUND(order_id));
            }

            newAssignedOrder = dbOrder;
        }

        // Price of delivery
        let newDeliveryPrice: number | undefined;
        if (delivery_charge !== undefined) {
            // If a new order is assigned, then the delivery price is the price of the new order + new delivery charge
            if (newAssignedOrder !== null) {
                newDeliveryPrice = +newAssignedOrder.order_price + delivery_charge;
            }
            // If a new order is not assigned, then the delivery price is the price of the old order + new delivery charge
            if (newAssignedOrder === null) {
                if (dbDelivery.Order !== null) {
                    newDeliveryPrice = +dbDelivery.Order.order_price + delivery_charge;
                }
            }
        }
        // If a new delivery charge is not specified and a new order is assigned, then the delivery price is the price of the new order + old delivery charge
        if (delivery_charge === undefined && newAssignedOrder !== null) {
            // If we have an old order, then we add the old delivery charge to the new order price
            if (dbDelivery.Order !== null) {
                newDeliveryPrice = +newAssignedOrder.order_price + ((+dbDelivery.delivery_price) - (+dbDelivery.Order.order_price));
            }
            // If we don't have an old order, then should throw an error
            else {
                throw new BadRequestException(DELIVERY_ERRORS.NO_DELIVERY_CHARGE_ON_UPDATE);
            }
        }

        const isDeliveryAlreadyAssigned = dbDelivery.delivery_boy_id !== null;

        const updatedDbDelivery = await this.prisma.delivery.update({
            where: {
                delivery_id: deliveryId,
            },
            data: {
                delivery_boy_id: this.getDeliveryBoyIdForUpdate(delivery_boy_id, isUserAdminOrManager, isUserEmployee, isDeliveryAlreadyAssigned),
                delivery_address: delivery_address,
                delivery_finished_at: delivery_finished_at ? new Date(dayjs(delivery_finished_at, 'DD-MM-YYYY').format('YYYY-MM-DD')) : undefined,
                delivery_status: delivery_status,
                delivery_order_id: order_id,
                delivery_price: newDeliveryPrice,
            },
            select: {
                delivery_address: true,
                delivery_boy: {
                    select: {
                        user_id: true,
                        user_firstname: true,
                        user_lastname: true,
                        user_phone: true,
                    }
                },
                delivery_created_at: true,
                delivery_finished_at: true,
                delivery_id: true,
                delivery_price: true,
                delivery_status: true,
                Order: {
                    select: {
                        order_created_at: true,
                        order_id: true,
                        order_price: true,
                        order_status: true,
                        payment: {
                            select: {
                                payment_date: true,
                                payment_id: true,
                                payment_type: true,
                            }
                        },
                        products: {
                            select: {
                                amount: true,
                                product: {
                                    select: {
                                        product_id: true,
                                        product_name: true,
                                        product_description: true,
                                        product_image: true,
                                        product_price: true,
                                    }
                                }
                            }
                        },
                        user: {
                            select: {
                                user_address: true,
                                user_email: true,
                                user_lastname: true,
                                user_firstname: true,
                                user_id: true,
                                user_phone: true,
                                user_type: true,
                            }
                        }
                    }
                }
            }
        });

        const updatedDelivery: UpdateDeliveryByIdReturnType = {
            delivery_address: updatedDbDelivery.delivery_address,
            delivery_boy: updatedDbDelivery.delivery_boy,
            delivery_created_at: updatedDbDelivery.delivery_created_at,
            delivery_finished_at: updatedDbDelivery.delivery_finished_at,
            delivery_id: updatedDbDelivery.delivery_id,
            delivery_price: updatedDbDelivery.delivery_price,
            delivery_status: updatedDbDelivery.delivery_status,
            order: updatedDbDelivery.Order ? {
                order_created_at: updatedDbDelivery.Order.order_created_at,
                order_id: updatedDbDelivery.Order.order_id,
                order_price: updatedDbDelivery.Order.order_price,
                order_status: updatedDbDelivery.Order.order_status,
                payment: updatedDbDelivery.Order.payment ? {
                    payment_date: updatedDbDelivery.Order.payment.payment_date,
                    payment_id: updatedDbDelivery.Order.payment.payment_id,
                    payment_type: updatedDbDelivery.Order.payment.payment_type,
                } : null,
                products: updatedDbDelivery.Order.products.map(product => {
                    return {
                        amount: product.amount,
                        product_description: product.product.product_description,
                        product_id: product.product.product_id,
                        product_image: product.product.product_image,
                        product_name: product.product.product_name,
                        product_price: product.product.product_price,
                    };
                }),
                user: {
                    user_address: updatedDbDelivery.Order.user.user_address,
                    user_email: updatedDbDelivery.Order.user.user_email,
                    user_firstname: updatedDbDelivery.Order.user.user_firstname,
                    user_id: updatedDbDelivery.Order.user.user_id,
                    user_lastname: updatedDbDelivery.Order.user.user_lastname,
                    user_phone: updatedDbDelivery.Order.user.user_phone,
                    user_type: updatedDbDelivery.Order.user.user_type,
                }
            } : null
        };

        return updatedDelivery;
    }

    public async deleteDelivery(userId: number, deliveryId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                user_id: userId,
            },
            select: {
                user_type: true,
            }
        });
        if (user === null) {
            throw new NotFoundException(USER_ERRORS.NOT_FOUND());
        }

        const isUserAdminOrManager = user.user_type === 'ADMIN' || user.user_type === 'MANAGER';

        // Check if delivery is not finished and if any payments are made
        const delivery = await this.prisma.delivery.findUnique({
            where: {
                delivery_id: deliveryId,
            },
            select: {
                delivery_status: true,
                Order: {
                    select: {
                        user: {
                            select: {
                                user_id: true,
                            }
                        },
                        payment: {
                            select: {
                                payment_id: true,
                            }
                        }
                    }
                }
            }
        });

        if (delivery === null) {
            throw new NotFoundException(DELIVERY_ERRORS.NOT_FOUND());
        }

        if (delivery.delivery_status === 'DONE') {
            throw new BadRequestException(DELIVERY_ERRORS.FINISHED_DELIVERY);
        }

        if (delivery.Order?.payment !== null) {
            throw new BadRequestException(DELIVERY_ERRORS.PAYMENT_MADE);
        }

        if (isUserAdminOrManager === false && delivery.Order.user.user_id !== userId) {
            throw new ForbiddenException('You are not allowed to delete this delivery');
        }

        // Delete delivery
        await this.prisma.delivery.delete({
            where: {
                delivery_id: deliveryId,
            }
        });
    }

    private getDeliveryBoyIdForUpdate(deliveryBoyId: number | undefined, isUserAdminOrManager: boolean, isUserEmployee: boolean, isDeliveryAlreadyAssigned: boolean): number | undefined {
        let returnedDeliveryBoyId: number | undefined;

        if (isUserAdminOrManager) {
            returnedDeliveryBoyId = deliveryBoyId;
        }

        if (isUserEmployee) {
            if (isDeliveryAlreadyAssigned === false) {
                returnedDeliveryBoyId = deliveryBoyId;
            }
        }

        return returnedDeliveryBoyId;
    }
}
