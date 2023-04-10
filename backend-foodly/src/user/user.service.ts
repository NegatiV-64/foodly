import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash, verify } from 'argon2';
import { USER_ERRORS } from 'src/shared/errors';
import type { CreateUserDto, ValidateUser } from './dto';
import type { GetUsersQueryParams } from './interfaces';
import type { GetUserDeliveryPerformed, GetUserResponse } from './responses/get-user.response';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { UpdateUserResponse } from './responses/update-user.response';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    public async createUser({ email, password, phone, verifyToken, type }: CreateUserDto) {
        const hashedPassword = await hash(password);

        const newUser = await this.prisma.user.create({
            data: {
                user_email: email,
                user_phone: phone,
                user_password: hashedPassword,
                user_is_verified: false,
                user_confirm_code: verifyToken,
                user_type: type,
            }
        });

        return newUser;
    }

    public async findUserByEmail(email: string) {
        const foundUser = await this.prisma.user.findUnique({
            where: {
                user_email: email,
            },
        });

        if (foundUser === null) {
            throw new NotFoundException(USER_ERRORS.NOT_FOUND('email'));
        }

        return foundUser;
    }

    public async getUsers(userId: number, { order = 'desc', role, search, skip, sort = 'user_id', take }: GetUsersQueryParams) {
        const user = await this.prisma.user.findUnique({
            where: {
                user_id: userId,
            },
            select: {
                user_type: true,
            }
        });

        if (user === null) {
            throw new NotFoundException(USER_ERRORS.NOT_FOUND('id'));
        }

        if (user.user_type !== 'ADMIN' && user.user_type !== 'MANAGER') {
            throw new ForbiddenException(USER_ERRORS.FORBIDDEN);
        }

        const userWhere = {
            user_type: {
                equals: role,
            },
            user_firstname: search ? {
                contains: search.split(' ')[0],
            } : undefined,
            user_lastname: search ? {
                contains: search.split(' ')[1],
            } : undefined,
        };

        const [users, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                where: userWhere,
                select: {
                    user_id: true,
                    user_email: true,
                    user_phone: true,
                    user_type: true,
                    user_firstname: true,
                    user_lastname: true,
                    user_is_verified: true,
                    user_address: true,
                },
                orderBy: {
                    [sort]: order,
                },
                skip,
                take,
            }),
            this.prisma.user.count({
                where: userWhere,
            }),
        ]);

        return {
            users,
            total,
        };
    }

    public async getUserById(currentUserId: number, userId: number): Promise<GetUserResponse> {
        const user = await this.prisma.user.findUnique({
            where: {
                user_id: currentUserId,
            },
            select: {
                user_type: true,
            }
        });

        if (user === null) {
            throw new NotFoundException(USER_ERRORS.NOT_FOUND('id'));
        }

        if (user.user_type !== 'ADMIN' && user.user_type !== 'MANAGER') {
            throw new ForbiddenException(USER_ERRORS.FORBIDDEN);
        }

        const foundUser = await this.prisma.user.findUnique({
            where: {
                user_id: userId,
            },
            select: {
                user_id: true,
                user_email: true,
                user_phone: true,
                user_type: true,
                user_firstname: true,
                user_lastname: true,
                user_is_verified: true,
                user_address: true,
                delivery: {
                    select: {
                        delivery_id: true,
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
                        delivery_price: true,
                        delivery_status: true,
                    },
                },
                order: {
                    select: {
                        order_id: true,
                        order_created_at: true,
                        order_price: true,
                        order_status: true,
                    }
                },
                payment: {
                    select: {
                        payment_id: true,
                        payment_date: true,
                        payment_type: true,
                        payment_order_id: true,
                    }
                },
                feedback: {
                    select: {
                        feedback_id: true,
                        feedback_text: true,
                        feedback_created_at: true,
                    }
                }
            }
        });

        if (foundUser === null) {
            throw new NotFoundException(USER_ERRORS.NOT_FOUND('id'));
        }

        let deliveriesOfUser: GetUserDeliveryPerformed[] | null = null;

        if (foundUser.user_type === 'ADMIN' || foundUser.user_type === 'MANAGER' || foundUser.user_type === 'DELIVERY_BOY') {
            const dbDeliveries = await this.prisma.delivery.findMany({
                where: {
                    delivery_boy_id: userId,
                },
                select: {
                    delivery_id: true,
                    delivery_address: true,
                    delivery_created_at: true,
                    delivery_finished_at: true,
                    delivery_price: true,
                    delivery_status: true,
                    Order: {
                        select: {
                            order_id: true,
                            order_user_id: true,
                        }
                    }
                }
            });

            deliveriesOfUser = dbDeliveries.map(delivery => ({
                delivery_address: delivery.delivery_address,
                delivery_created_at: delivery.delivery_created_at,
                delivery_finished_at: delivery.delivery_finished_at,
                delivery_id: delivery.delivery_id,
                delivery_price: delivery.delivery_price,
                delivery_status: delivery.delivery_status,
                order_id: delivery.Order ? delivery.Order.order_id : null,
                order_user_id: delivery.Order ? delivery.Order.order_user_id : null,
            }));
        }

        return {
            user_address: foundUser.user_address,
            user_email: foundUser.user_email,
            user_firstname: foundUser.user_firstname,
            user_id: foundUser.user_id,
            user_is_verified: foundUser.user_is_verified,
            user_lastname: foundUser.user_lastname,
            user_phone: foundUser.user_phone,
            user_type: foundUser.user_type,
            deliveries: foundUser.delivery,
            deliveries_performed: deliveriesOfUser,
            orders: foundUser.order,
            payments: foundUser.payment,
            feedbacks: foundUser.feedback,
        };
    }

    public async verifyUser(email: string) {
        await this.prisma.user.update({
            where: {
                user_email: email,
            },
            data: {
                user_confirm_code: null,
                user_is_verified: true
            }
        });
    }

    public async validateUser({ email, password }: ValidateUser) {
        const foundUser = await this.findUserByEmail(email);
        const isPasswordValid = await verify(foundUser.user_password, password);

        if (isPasswordValid === false) {
            throw new NotFoundException(USER_ERRORS.WRONG_PASSWORD);
        }

        if (foundUser.user_is_verified === false) {
            throw new ForbiddenException(USER_ERRORS.NOT_VERIFIED);
        }

        return foundUser;
    }

    public async updateUserRefreshToken(email: string, refreshToken: string) {
        const hashedRefreshToken = await hash(refreshToken);

        await this.prisma.user.update({
            where: {
                user_email: email,
            },
            data: {
                user_refresh_token: hashedRefreshToken,
            }
        });
    }

    public async findUserById(userId: number) {
        const foundUser = await this.prisma.user.findUnique({
            where: {
                user_id: userId,
            }
        });

        if (foundUser === null) {
            throw new NotFoundException(USER_ERRORS.NOT_FOUND('id'));
        }

        return foundUser;
    }

    public async getUserDetails(userId: number) {
        const foundUser = await this.prisma.user.findUnique({
            where: {
                user_id: userId,
            },
            select: {
                delivery: {
                    skip: 0,
                    take: 5,
                },
                feedback: {
                    skip: 0,
                    take: 5,
                },
                order: {
                    skip: 0,
                    take: 5,
                },
                payment: {
                    skip: 0,
                    take: 5,
                },
                user_address: true,
                user_confirm_code: false,
                user_email: true,
                user_firstname: true,
                user_id: true,
                user_is_verified: true,
                user_lastname: true,
                user_password: false,
                user_phone: true,
                user_refresh_token: false,
                user_type: true,
            }
            // include: {
            //     delivery: {
            //         skip: 0,
            //         take: 5,
            //     },
            //     feedback: {
            //         skip: 0,
            //         take: 5,
            //     },
            //     order: {
            //         skip: 0,
            //         take: 5,
            //     },
            //     payment: {
            //         skip: 0,
            //         take: 5,
            //     },
            // }
        });

        if (foundUser === null) {
            throw new NotFoundException(USER_ERRORS.NOT_FOUND('id'));
        }

        return foundUser;
    }

    public async updateUserById(currentUserId: number, userId: number, { address, email, firstname, is_verified, lastname, password, phone, role }: UpdateUserDto): Promise<UpdateUserResponse> {
        const currentUser = await this.prisma.user.findUnique({
            where: {
                user_id: currentUserId,
            },
            select: {
                user_type: true,
            }
        });

        if (currentUser === null) {
            throw new NotFoundException(USER_ERRORS.NOT_FOUND('id'));
        }

        if (currentUser.user_type !== 'ADMIN' && currentUser.user_type !== 'MANAGER') {
            throw new ForbiddenException(USER_ERRORS.FORBIDDEN);
        }

        const foundUser = await this.prisma.user.findUnique({
            where: {
                user_id: userId,
            }
        });

        if (foundUser === null) {
            throw new BadRequestException(USER_ERRORS.NOT_FOUND('id'));
        }

        const hashedPassword = password && currentUser.user_type === 'ADMIN' ? await hash(password) : undefined;

        const updatedUser = await this.prisma.user.update({
            where: {
                user_id: userId,
            },
            data: {
                user_address: address,
                user_email: email,
                user_firstname: firstname,
                user_is_verified: is_verified,
                user_lastname: lastname,
                user_password: hashedPassword,
                user_phone: phone,
                user_type: role,
            },
            select: {
                user_address: true,
                user_email: true,
                user_firstname: true,
                user_id: true,
                user_is_verified: true,
                user_lastname: true,
                user_phone: true,
                user_type: true,
            }
        });

        return updatedUser;
    }

    public async deleteUser(userId: number) {
        await this.prisma.user.delete({
            where: {
                user_id: userId,
            }
        });
    }
}
