import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeService } from 'src/employee/employee.service';
import { CATEGORY_ERRORS } from 'src/shared/errors/errors';
import { PrismaService } from 'src/prisma/prisma.service';
import { slugify } from 'src/shared/utils/slugify.util';
import type { CreateCategoryDto } from './dto/create-category.dto';
import type { UpdateCategoryDto } from './dto/update-category.dto';
import type { GetCategoriesQueries } from './interfaces/GetCategoriesQueries.interface';
import type { GetCategoriesWithProductsQueryParams } from './interfaces/GetCategoriesWithProductsQueryParams.interface';

@Injectable()
export class CategoryService {
    constructor(
        private prisma: PrismaService,
        private employeeService: EmployeeService,
    ) { }

    public async createCategory(userId: number, { category_icon, category_name }: CreateCategoryDto) {
        await this.employeeService.checkEmployeeType(userId, 'ADMIN', 'MANAGER');

        try {
            const category = await this.prisma.category.create({
                data: {
                    category_icon: category_icon,
                    category_name: category_name,
                    category_slug: slugify(category_name),
                }
            });

            return category;
        }

        catch (error: any) {
            // Prisma has bug with error handling, so we need to check error manually. More info: https://github.com/prisma/prisma/issues/12128
            if (error?.constructor?.name === 'PrismaClientKnownRequestError') {
                if (error?.code && error?.code === 'P2002') {
                    throw new BadRequestException(CATEGORY_ERRORS.ALREADY_EXISTS);
                }
            }

            throw new Error(error.message);
        }
    }


    public async getCategories({ order = 'asc', skip, take }: GetCategoriesQueries) {
        const [categoriesAmount, categories] = await this.prisma.$transaction([
            this.prisma.category.count(),
            this.prisma.category.findMany({
                orderBy: {
                    category_name: order,
                },
                skip: skip,
                take: take,
            })
        ]);

        return {
            categories,
            total: categoriesAmount
        };
    }

    public async getCategory(searchType: 'category_id' | 'category_slug', searchValue: number | string) {
        const category = await this.prisma.category.findUnique({
            where: {
                [searchType]: searchValue,
            },
        });

        if (!category) {
            throw new NotFoundException(CATEGORY_ERRORS.NOT_FOUND(searchType));
        }

        return category;
    }

    public async getCategoryWithProducts(searchType: 'category_id' | 'category_slug', searchValue: number | string, {
        order = 'asc', skip, take
    }: GetCategoriesWithProductsQueryParams) {
        const category = await this.prisma.category.findUnique({
            where: {
                [searchType]: searchValue,
            },
            include: {
                products: {
                    skip: skip,
                    take: take,
                    orderBy: {
                        product_id: order,
                    }
                },
            },
        });

        if (!category) {
            throw new NotFoundException(CATEGORY_ERRORS.NOT_FOUND(searchType));
        }

        return category;
    }

    public async updateCategory(userId: number, categoryId: number, { category_icon, category_name }: UpdateCategoryDto) {
        await this.employeeService.checkEmployeeType(userId, 'ADMIN', 'MANAGER');

        const categorySlug = category_name ? slugify(category_name) : undefined;

        const updatedCategory = await this.prisma.category.update({
            data: {
                category_icon: category_icon,
                category_name: category_name,
                category_slug: categorySlug,
            },
            where: {
                category_id: categoryId,
            }
        });

        return updatedCategory;
    }

    public async deleteCategory(userId: number, categoryId: number) {
        await this.employeeService.checkEmployeeType(userId, 'ADMIN', 'MANAGER');

        const deletedCategory = await this.prisma.category.delete({
            where: {
                category_id: categoryId,
            }
        });

        return deletedCategory;
    }
}

