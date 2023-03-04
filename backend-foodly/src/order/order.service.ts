import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import type { Order, Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import type { OrderItem } from './dto/create-order.dto';
import type { GetOrdersQueryParams } from './interfaces/GetOrdersQueryParams.interface';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) { }

    public async createOrder(userId: number, products: OrderItem[]) {
        const foundProducts: Product[] = [];

        for (const product of products) {
            const foundProduct = await this.prisma.product.findUnique({
                where: {
                    product_id: product.product_id,
                },
            });

            if (foundProduct === null) {
                throw new BadRequestException(`Product with id ${product.product_id} does not exist.`);
            }

            foundProducts.push(foundProduct);
        }

        const priceOfProducts = foundProducts.reduce((acc, product) => {
            const orderItemWithProduct = products.find((orderItem) => orderItem.product_id === product.product_id);

            if (orderItemWithProduct === undefined) {
                return acc;
            }

            const priceOfProduct = +product.product_price * orderItemWithProduct.quantity;

            return acc + priceOfProduct;
        }, 0);

        const order = await this.prisma.order.create({
            data: {
                order_user_id: userId,
                order_price: priceOfProducts,
                order_status: 'HOLD',
            }
        });

        await this.prisma.productsOrders.createMany({
            data: products.map((product) => {
                return {
                    order_id: order.order_id,
                    product_id: product.product_id,
                    amount: product.quantity,
                };
            })
        });

        return {
            ...order,
            products: foundProducts,
        };
    }

    public async getOrders(userId: number, { created, order = 'asc', skip, sort = 'order_created_at', take, userSearch }: GetOrdersQueryParams): Promise<GetOrdersReturnType> {
        // Checking user
        const user = await this.prisma.user.findUnique({
            where: {
                user_id: userId,
            },
            select: {
                user_type: true,
            }
        });
        if (user === null) {
            throw new BadRequestException('User does not exist.');
        }

        const isUserEmployee = user.user_type === 'ADMIN' || user.user_type === 'MANAGER' || user.user_type === 'DELIVERY_BOY';
        if (isUserEmployee === false && userSearch !== undefined) {
            throw new BadRequestException('Only employees can search for orders by user.');
        }

        if (isUserEmployee === false) {
            const [orders, total] = await this.prisma.$transaction([
                this.prisma.order.findMany({
                    where: {
                        order_user_id: userId,
                        order_created_at: {
                            gte: created ? new Date(dayjs(created, 'DD-MM-YYYY').format('YYYY-MM-DD')) : undefined,
                        }
                    },
                    take: take,
                    skip: skip,
                    orderBy: {
                        [sort]: order,
                    }
                }),
                this.prisma.order.count({
                    where: {
                        order_user_id: userId,
                        order_created_at: {
                            gte: created ? new Date(dayjs(created, 'DD-MM-YYYY').format('YYYY-MM-DD')) : undefined,
                        }
                    }
                })
            ]);

            return {
                orders, total
            };
        }

        const [orders, total] = await this.prisma.$transaction([
            this.prisma.order.findMany({
                where: {
                    order_created_at: {
                        gte: created ? new Date(dayjs(created, 'DD-MM-YYYY').format('YYYY-MM-DD')) : undefined,
                    },
                    user: {
                        OR: [
                            {
                                user_firstname: {
                                    contains: userSearch,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                user_lastname: {
                                    contains: userSearch,
                                    mode: 'insensitive',
                                },
                            }
                        ]
                    },
                },
                take: take,
                skip: skip,
                orderBy: {
                    order_created_at: order,
                },
                include: {
                    user: {
                        select: {
                            user_id: true,
                            user_firstname: true,
                            user_lastname: true,
                            user_email: true,
                            user_phone: true,
                            user_address: true,
                            user_type: true,
                        }
                    }
                }
            }),
            this.prisma.order.count({
                where: {
                    order_created_at: {
                        gte: created ? new Date(dayjs(created, 'DD-MM-YYYY').format('YYYY-MM-DD')) : undefined,
                    },
                    user: {
                        OR: [
                            {
                                user_firstname: {
                                    contains: userSearch?.split(' ')[0],
                                    mode: 'insensitive',
                                },
                            },
                            {
                                user_lastname: {
                                    contains: userSearch?.split(' ')[1],
                                    mode: 'insensitive',
                                },
                            }
                        ]
                    },
                },
            })
        ]);

        return {
            orders, total
        };
    }

    public async getOrder(userId: number, orderId: string) {
        const order = await this.prisma.order.findUnique({
            where: {
                order_id: orderId,
            },
            include: {
                products: {
                    select: {
                        product: {
                            select: {
                                product_id: true,
                                product_name: true,
                                product_price: true,
                                product_description: true,
                                product_image: true,
                            }
                        }
                    }
                },
                user: {
                    select: {
                        user_id: true,
                        user_firstname: true,
                        user_lastname: true,
                        user_email: true,
                        user_phone: true,
                        user_address: true,
                        user_type: true,
                    }
                },
                delivery: {
                    select: {
                        delivery_id: true,
                        delivery_address: true,
                        delivery_status: true,
                        delivery_date: true,
                        delivery_price: true,
                        delivery_user: true,
                    }
                },
                payment: {
                    select: {
                        payment_id: true,
                        payment_date: true,
                        payment_type: true,
                    }
                }
            }
        });

        if (order === null) {
            throw new BadRequestException('Order does not exist.');
        }

        if (userId !== order.order_user_id) {
            const userToValidate = await this.prisma.user.findUnique({
                where: {
                    user_id: userId,
                },
                select: {
                    user_type: true,
                }
            });

            if (userToValidate === null) {
                throw new BadRequestException('User does not exist.');
            }

            if (userToValidate.user_type === 'CUSTOMER') {
                throw new ForbiddenException('You are not allowed to access this order.');
            }
        }

        const formattedOrder = {
            ...order,
            products: order.products.map(product => product.product),
        };

        return formattedOrder;
    }
}

type GetOrdersReturnType = {
    orders: Order[];
    total: number;
};