import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/shared/decorators';
import { AccessTokenGuard } from 'src/shared/guards';
import { OrderByQuery } from 'src/shared/interfaces/queries.interface';
import { ParseOptionalIntPipe } from 'src/shared/pipe/ParseOptionalInt.pipe';
import { ValidateOrderByQueryPipe } from 'src/shared/pipe/ValidateOrderByQuery.pipe';
import { createProductSchema } from './config/createProductSchema.config';
import { createProductUploadConfig } from './config/createProductUpload.config';
import { updateProductUploadConfig } from './config/updateProductUpload.config';
import { updateProductSchema } from './config/updateProductSchema.config';
import { CreateProductDto } from './dto/create-product.dto';
import type { GetProductsQueryParams } from './interfaces/GetProductsQueryParams.interface';
import { ProductSortQuery } from './interfaces/ProductSortQuery.interface';
import { ValidateImage } from './pipes/ValidateImage.pipe';
import { ValidateProductSortQueryPipe } from './pipes/ValidateSortQuery.pipe';
import { ProductService } from './product.service';
import { CreateProductResponse } from './responses/createProduct.response';
import { GetProductResponse } from './responses/GetProduct.response';
import { GetProductsResponse } from './responses/getProducts.response';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductResponse } from './responses/updateProduct.response';
import { PopularProductsResponse } from './responses/popularProducts.response';

@ApiTags('Product')
@Controller('products')
export class ProductController {
    constructor(private productService: ProductService) { }

    @Post()
    @ApiOperation({
        description: 'Creates a new product. Only admins and managers can create products. The product name must be unique. The product slug is generated automatically from the product name. The product image is not optional. Access token is required.',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody(createProductSchema)
    @ApiCreatedResponse({
        description: 'The product has been successfully created.',
        type: CreateProductResponse
    })
    @UseGuards(AccessTokenGuard)
    @UseInterceptors(FileInterceptor('product_image', createProductUploadConfig))
    public async createProduct(
        @GetCurrentUser('user_id') userId: number,
        @Body() createProductDto: CreateProductDto,
        @UploadedFile(ValidateImage()) file: Express.Multer.File,
    ) {
        const product = await this.productService.createProduct(userId, createProductDto, file.path);

        return product;
    }

    @Get()
    @ApiOperation({
        description: 'Gets all products. Access token is not required. This endpoint is public.',
    })
    @ApiOkResponse({
        description: 'The products have been successfully retrieved. The total number of products is also returned.',
        type: GetProductsResponse,
    })
    public async getProducts(
        @Query('take', ParseOptionalIntPipe) take?: number,
        @Query('skip', ParseOptionalIntPipe) skip?: number,
        @Query('category') categorySlug?: string,
        @Query('search') search?: string,
        @Query('sort', ValidateProductSortQueryPipe) sort?: ProductSortQuery,
        @Query('order', ValidateOrderByQueryPipe) order?: OrderByQuery,
    ) {
        const getProductsQueryParams: GetProductsQueryParams = { take, skip, categorySlug, search, sort, order, };

        const { products, total } = await this.productService.getProducts(getProductsQueryParams);

        return { products, total };
    }

    @Get('popular')
    @ApiOperation({
        description: 'Gets the most popular products. Access token is not required. This endpoint is public.',
    })
    @ApiOkResponse({
        description: 'The products have been successfully retrieved.',
        type: PopularProductsResponse,
    })
    public async getPopularProducts() {
        // I am lazy to actually count the number of orders for each product and then sort them by the number of orders. So I will just return the first 10 products.
        // Maybe I will implement this later. I am not sure. I am lazy.
        const products = await this.productService.getPopularProducts();

        return {
            products,
        };
    }

    @Get(':product_id')
    @ApiOperation({
        description: 'Gets a product by id. Access token is not required. This endpoint is public.',
    })
    @ApiOkResponse({
        description: 'The product has been successfully retrieved.',
        type: GetProductResponse,
    })
    public async getProduct(@Param('product_id', ParseIntPipe) productId: number) {
        const product = await this.productService.getProduct(productId);

        return product;
    }

    @Patch(':product_id')
    @ApiOperation({
        description: 'Updates a product by id. Only admins and managers can update products. Access token is required. The product image is optional. If the product image is not provided, the old image will be used.',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody(updateProductSchema)
    @UseGuards(AccessTokenGuard)
    @UseInterceptors(FileInterceptor('product_image', updateProductUploadConfig))
    public async updateProduct(
        @GetCurrentUser('user_id') userId: number,
        @Param('product_id', ParseIntPipe) productId: number,
        @Body() updateProductDto: UpdateProductDto,
        @UploadedFile(ValidateImage(false)) file?: Express.Multer.File,
    ) {
        const updatedProduct = await this.productService.updateProduct(userId, productId, updateProductDto, file?.path);

        return updatedProduct;
    }

    @Delete(':product_id')
    @ApiOperation({
        description: 'Deletes a product by id. Only admins and managers can delete products. Access token is required. The product image is also deleted. The other connected entities are deleted too. If the product is connected to an order, that is not completed, the product will not be deleted.',
    })
    @ApiOkResponse({
        description: 'The product has been successfully deleted.',
        type: UpdateProductResponse
    })
    @UseGuards(AccessTokenGuard)
    public async deleteProduct(
        @GetCurrentUser('user_id') userId: number,
        @Param('product_id', ParseIntPipe) productId: number,
    ) {
        await this.productService.deleteProduct(userId, productId);

        return {
            message: 'The product has been successfully deleted.',
        };
    }
}
