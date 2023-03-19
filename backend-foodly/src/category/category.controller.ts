import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/shared/decorators';
import { AccessTokenGuard } from 'src/shared/guards';
import { OrderByQuery } from 'src/shared/interfaces';
import { ValidateOrderByQueryPipe } from 'src/shared/pipe';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import type { GetCategoriesQueries } from './interfaces';
import { CreateCategoryResponse, GetCategoriesResponse, UpdateCategoryResponse, GetCategoryResponse, DeleteCategoryResponse } from './responses';

@ApiTags('Category')
@Controller('categories')
export class CategoryController {
    constructor(private categoryService: CategoryService) { }

    @Post()
    @ApiOperation({
        description: 'Creates a new category. Only admins and managers can create categories. The category name must be unique. The category slug is generated automatically from the category name. The category icon must be an emoji. Example: 🍕. Access token is required.',
    })
    @ApiCreatedResponse({
        type: CreateCategoryResponse
    })
    @UseGuards(AccessTokenGuard)
    public async createCategory(
        @GetCurrentUser('user_id') userId: number,
        @Body() dto: CreateCategoryDto,
    ) {
        const category = await this.categoryService.createCategory(userId, dto);

        return category;
    }

    @Get()
    @ApiOperation({
        description: 'Gets all categories. Access token is required.',
    })
    @ApiOkResponse({
        type: GetCategoriesResponse
    })
    public async getCategories(
        @Query('take') take?: number,
        @Query('skip') skip?: number,
        @Query('order', ValidateOrderByQueryPipe) order?: OrderByQuery,
    ) {
        const getCategoriesQueries: GetCategoriesQueries = {
            order: order,
            skip: skip,
            take: take,
        };

        const { categories, total } = await this.categoryService.getCategories(getCategoriesQueries);

        return {
            categories,
            total,
        };
    }

    @Patch('/:category_id')
    @ApiOperation({
        description: 'Updates a category. Only admins and managers can update categories. The category name must be unique. The category slug is generated automatically from the category name. The category icon must be an emoji. Example: 🍕. Access token is required.',
    })
    @ApiOkResponse({
        type: UpdateCategoryResponse
    })
    @UseGuards(AccessTokenGuard)
    public async updateCategory(
        @GetCurrentUser('user_id') userId: number,
        @Param('category_id') categoryId: number,
        @Body() dto: UpdateCategoryDto,
    ) {
        const updatedCategory = await this.categoryService.updateCategory(userId, categoryId, dto);

        return updatedCategory;
    }

    @Get('/:category_slug')
    @ApiOperation({
        description: 'Gets a category by slug. Access token is not required.',
    })
    @ApiOkResponse({
        type: GetCategoryResponse
    })
    public async getCategory(
        @Param('category_slug') categorySlug: string,
    ) {
        const category = await this.categoryService.getCategory('category_slug', categorySlug);

        return category;
    }

    @Get('/:category_slug/products')
    @ApiOperation({
        description: 'Gets all products from a category with data about the category. Access token is not required. The route is public. You can use the query parameters to paginate the products. Sort is only available by product id. Example: /categories/pizza/products?take=10&skip=0&order=id:asc',
    })
    public async getCategoryWithProducts(
        @Param('category_slug') categorySlug: string,
        @Query('take') take?: number,
        @Query('skip') skip?: number,
        @Query('order', ValidateOrderByQueryPipe) order?: OrderByQuery,
    ) {
        const category = await this.categoryService.getCategoryWithProducts('category_slug', categorySlug, {
            order,
            skip,
            take,
        });

        return category;
    }

    @Delete('/:category_id')
    @ApiOperation({
        description: 'Deletes a category. Only admins and managers can delete categories. Access token is required.',
    })
    @ApiNoContentResponse({
        type: DeleteCategoryResponse,
    })
    @UseGuards(AccessTokenGuard)
    public async deleteCategory(
        @GetCurrentUser('user_id') userId: number,
        @Param('category_id') categoryId: number,
    ) {
        await this.categoryService.deleteCategory(userId, categoryId);

        return {
            message: 'Category deleted successfully.',
        };
    }
}
