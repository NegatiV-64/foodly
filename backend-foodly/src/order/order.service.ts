import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma, Order, OrderStatus, Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import type { CreateOrderReturnType, GetOrderReturnType, GetOrdersQueryParams, UpdateOrderReturnType } from './interfaces';
import type { OrderItem } from './dto';
import { USER_ERRORS, ORDER_ERRORS } from 'src/shared/errors';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) { }

    public async createOrder(userId: number, products: OrderItem[]): Promise<CreateOrderReturnType> {
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
            },
            select: {
                order_id: true,
                order_created_at: true,
                order_price: true,
                order_status: true,
                order_user_id: true,
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

        const orderWithProducts: CreateOrderReturnType = {
            ...order,
            products: foundProducts,
        };

        return orderWithProducts;
    }

    public async getOrders(userId: number, { hasDelivery, status, created, order = 'asc', skip, sort = 'order_created_at', take, userSearch }: GetOrdersQueryParams): Promise<GetOrdersReturnType> {
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
            throw new NotFoundException(USER_ERRORS.NOT_FOUND());
        }

        const isUserEmployee = user.user_type === 'ADMIN' || user.user_type === 'MANAGER' || user.user_type === 'DELIVERY_BOY';
        if (isUserEmployee === false && userSearch !== undefined) {
            throw new BadRequestException(ORDER_ERRORS.NOT_EMPLOYEE);
        }

        const orderCreateAtQuery = created ? new Date(created) : undefined;

        const orderWhereQuery: Prisma.OrderWhereInput = {
            order_created_at: orderCreateAtQuery ? {
                gte: orderCreateAtQuery,
            } : undefined,
            order_status: status,
            order_user_id: isUserEmployee ? undefined : userId,
            user: isUserEmployee ? {
                user_firstname: userSearch ? {
                    contains: userSearch?.split(' ')[0],
                    mode: 'insensitive',
                } : undefined,
                user_lastname: userSearch ? {
                    contains: userSearch?.split(' ')[1],
                    mode: 'insensitive',
                } : undefined,
            } : undefined,
        };

        if (hasDelivery !== undefined) {
            if (hasDelivery === true) {
                orderWhereQuery.order_delivery_id = {
                    not: null,
                };
            }

            if (hasDelivery === false) {
                orderWhereQuery.order_delivery_id = null;
            }
        }

        if (isUserEmployee === false) {
            const [orders, total] = await this.prisma.$transaction([
                this.prisma.order.findMany({
                    where: {
                        order_user_id: userId,
                        order_created_at: {
                            gte: orderCreateAtQuery,
                        },
                        order_status: status,
                    },
                    take: take,
                    skip: skip,
                    orderBy: {
                        [sort]: order,
                    }
                }),
                this.prisma.order.count({
                    where: orderWhereQuery,
                })
            ]);

            return {
                orders, total
            };
        }

        const [orders, total] = await this.prisma.$transaction([
            this.prisma.order.findMany({
                where: orderWhereQuery,
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
                where: orderWhereQuery,
            })
        ]);

        return {
            orders, total
        };
    }

    public async getOrder(userId: number, orderId: string): Promise<GetOrderReturnType> {
        const dbOrder = await this.prisma.order.findUnique({
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
                        },
                        amount: true,
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
                        delivery_boy: {
                            select: {
                                user_id: true,
                                user_firstname: true,
                                user_lastname: true,
                                user_phone: true,
                            },
                        },
                        delivery_status: true,
                        delivery_price: true,
                        delivery_address: true,
                        delivery_created_at: true,
                        delivery_finished_at: true,
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

        // If order does not exist, throw an error
        if (dbOrder === null) {
            throw new NotFoundException(ORDER_ERRORS.NOT_FOUND());
        }

        // If user is not an employee, check if he is the owner of the order.
        // If not, throw an error
        if (userId !== dbOrder.order_user_id) {
            const userToValidate = await this.prisma.user.findUnique({
                where: {
                    user_id: userId,
                },
                select: {
                    user_type: true,
                }
            });

            if (userToValidate === null) {
                throw new NotFoundException(USER_ERRORS.NOT_FOUND());
            }

            if (userToValidate.user_type === 'CUSTOMER') {
                throw new ForbiddenException(ORDER_ERRORS.NOT_EMPLOYEE);
            }
        }


        // Modify the order to match the GetOrder interface
        const order: GetOrderReturnType = {
            ...dbOrder,
            products: dbOrder.products.map(product => ({
                product_description: product.product.product_description,
                product_id: product.product.product_id,
                product_image: product.product.product_image,
                product_name: product.product.product_name,
                product_price: product.product.product_price,
                amount: product.amount,
            })),
        };

        return order;
    }

    public async deleteOrder(userId: number, orderId: string): Promise<void> {
        const isUserEmployee = await this.isUserEmployee(userId);

        const orderWhereQuery: Prisma.OrderWhereInput = {
            order_id: orderId,
            user: {
                user_id: isUserEmployee === true ? undefined : userId,
            }
        };

        await this.validateOrder('first', orderWhereQuery);

        await this.prisma.order.delete({
            where: {
                order_id: orderId,
            }
        });
    }

    public async updateOrderStatus(userId: number, orderId: string, status: OrderStatus): Promise<UpdateOrderReturnType> {
        const isUserEmployee = await this.isUserEmployee(userId);

        if (isUserEmployee === false) {
            const order = await this.prisma.order.findUnique({
                where: {
                    order_id: orderId,
                },
            });

            if (order === null) {
                throw new NotFoundException(ORDER_ERRORS.NOT_FOUND());
            }

            const dbUpdatedOrder = await this.prisma.order.update({
                where: {
                    order_id: orderId,
                },
                data: {
                    order_status: status,
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
                            },
                            amount: true,
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
                            delivery_boy: {
                                select: {
                                    user_id: true,
                                    user_firstname: true,
                                    user_lastname: true,
                                    user_phone: true,
                                },
                            },
                            delivery_status: true,
                            delivery_price: true,
                            delivery_address: true,
                            delivery_created_at: true,
                            delivery_finished_at: true,
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

            const updatedOrder: UpdateOrderReturnType = {
                ...dbUpdatedOrder,
                products: dbUpdatedOrder.products.map(product => ({
                    product_description: product.product.product_description,
                    product_id: product.product.product_id,
                    product_image: product.product.product_image,
                    product_name: product.product.product_name,
                    product_price: product.product.product_price,
                    amount: product.amount,
                })),
            };

            return updatedOrder;
        }

        const dbUpdatedOrder = await this.prisma.order.update({
            where: {
                order_id: orderId,
            },
            data: {
                order_status: status,
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
                            },
                        },
                        amount: true,
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
                        delivery_boy: {
                            select: {
                                user_id: true,
                                user_firstname: true,
                                user_lastname: true,
                                user_phone: true,
                            },
                        },
                        delivery_status: true,
                        delivery_price: true,
                        delivery_address: true,
                        delivery_created_at: true,
                        delivery_finished_at: true,
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

        const updatedOrder: UpdateOrderReturnType = {
            ...dbUpdatedOrder,
            products: dbUpdatedOrder.products.map(product => ({
                product_description: product.product.product_description,
                product_id: product.product.product_id,
                product_image: product.product.product_image,
                product_name: product.product.product_name,
                product_price: product.product.product_price,
                amount: product.amount,
            })),
        };

        return updatedOrder;
    }

    private async isUserEmployee(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                user_id: userId,
            },
        });

        if (user === null) {
            throw new NotFoundException(USER_ERRORS.NOT_FOUND());
        }

        const isUserEmployee = user.user_type === 'ADMIN' || user.user_type === 'DELIVERY_BOY' || user.user_type === 'MANAGER';

        return isUserEmployee;
    }

    private async validateOrder(findType: 'unique', findQuery: Prisma.OrderWhereUniqueInput): Promise<Order>;
    private async validateOrder(findType: 'first', findQuery: Prisma.OrderWhereInput): Promise<Order>;
    private async validateOrder(findType: 'unique' | 'first', findQuery: Prisma.OrderWhereInput | Prisma.OrderWhereUniqueInput,) {
        let order: Order | null = null;

        if (findType === 'unique') {
            const foundOrder = await this.prisma.order.findUnique({
                where: findQuery as Prisma.OrderWhereUniqueInput,
            });

            if (foundOrder === null) {
                throw new NotFoundException(ORDER_ERRORS.NOT_FOUND());
            }

            order = foundOrder;
        }

        if (findType === 'first') {
            const foundOrder = await this.prisma.order.findFirst({
                where: findQuery,
            });

            if (foundOrder === null) {
                throw new NotFoundException(ORDER_ERRORS.NOT_FOUND());
            }

            order = foundOrder;
        }

        if (order === null) {
            throw new NotFoundException(ORDER_ERRORS.NOT_FOUND());
        }

        return order;
    }
}

type GetOrdersReturnType = {
    orders: Order[];
    total: number;
};