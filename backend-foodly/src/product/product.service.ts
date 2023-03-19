import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';
import { EmployeeService } from 'src/employee/employee.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CATEGORY_ERRORS, PRODUCT_ERRORS } from 'src/shared/errors';
import type { CreateProductDto, UpdateProductDto } from './dto';
import type { GetProductsQueryParams } from './interfaces';

@Injectable()
export class ProductService {
    constructor(
        private prisma: PrismaService,
        private employeeService: EmployeeService,
    ) { }

    public async createProduct(userId: number, { product_category_id, product_description, product_name, product_price }: CreateProductDto, filePath: string) {
        await this.employeeService.checkEmployeeType(userId, 'ADMIN', 'MANAGER');

        const checkCategory = await this.prisma.category.findUnique({
            where: {
                category_id: product_category_id,
            }
        });

        if (!checkCategory) {
            throw new NotFoundException(CATEGORY_ERRORS.NOT_FOUND('id'));
        }

        const product = await this.prisma.product.create({
            data: {
                product_name: product_name,
                product_image: filePath,
                product_description: product_description,
                product_price: product_price,
                product_category_id: product_category_id,
            }
        });

        return product;
    }

    public async getProducts({ categorySlug, order, search, skip, sort = 'product_id', take }: GetProductsQueryParams) {
        const [products, total] = await this.prisma.$transaction([
            this.prisma.product.findMany({
                where: {
                    product_name: {
                        contains: search,
                    },
                    category: {
                        category_slug: categorySlug,
                    },
                },
                orderBy: {
                    [sort]: order,
                },
                take: take,
                skip: skip,
                include: {
                    category: true,
                }
            }),
            this.prisma.product.count({
                where: {
                    product_name: {
                        contains: search,
                    },
                    category: {
                        category_slug: categorySlug,
                    },
                },
            })
        ]);

        return { products, total };
    }

    public async getPopularProducts() {
        const products = await this.prisma.product.findMany({
            take: 12,
            skip: 0,
            orderBy: {
                product_id: 'desc',
            },
            include: {
                category: true,
            }
        });

        return products;
    }

    public async getProduct(productId: number) {
        const product = await this.prisma.product.findUnique({
            where: {
                product_id: productId,
            },
            include: {
                category: true,
            }
        });

        if (!product) {
            throw new NotFoundException(PRODUCT_ERRORS.NOT_FOUND('id'));
        }

        return product;
    }

    public async deleteProduct(userId: number, productId: number) {
        await this.employeeService.checkEmployeeType(userId, 'ADMIN', 'MANAGER');

        const product = await this.prisma.product.findUnique({
            where: {
                product_id: productId,
            },
        });

        if (!product) {
            throw new NotFoundException(PRODUCT_ERRORS.NOT_FOUND('id'));
        }

        const holdOrders = await this.prisma.order.findMany({
            where: {
                order_status: 'HOLD',
                products: {
                    some: {
                        product_id: productId,
                    }
                }
            }
        });

        if (holdOrders.length > 0) {
            throw new ConflictException(PRODUCT_ERRORS.DELETE_HOLD_ORDER_ERROR);
        }

        await this.prisma.product.delete({
            where: {
                product_id: productId,
            },
        });

        const pathToImage = join(cwd(), product.product_image);
        try {
            await unlink(pathToImage);
        } catch (error) {
            throw new InternalServerErrorException(PRODUCT_ERRORS.DELETE_IMAGE_ERROR);
        }
    }

    public async updateProduct(userId: number, productId: number, { product_category_id, product_description, product_name, product_price }: UpdateProductDto, filePath?: string) {
        await this.employeeService.checkEmployeeType(userId, 'ADMIN', 'MANAGER');

        const product = await this.prisma.product.findUnique({
            where: {
                product_id: productId,
            },
        });

        if (!product) {
            throw new NotFoundException(PRODUCT_ERRORS.NOT_FOUND('id'));
        }

        if (product_category_id !== undefined) {
            const checkCategory = await this.prisma.category.findUnique({
                where: {
                    category_id: product_category_id,
                }
            });

            if (!checkCategory) {
                throw new NotFoundException(CATEGORY_ERRORS.NOT_FOUND('id'));
            }
        }


        const updatedProduct = await this.prisma.product.update({
            where: {
                product_id: productId,
            },
            data: {
                product_name: product_name,
                product_image: filePath,
                product_description: product_description,
                product_price: product_price,
                product_category_id: product_category_id,
            }
        });

        return updatedProduct;
    }
}
