import { BadRequestException } from '@nestjs/common';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';

export const updateProductUploadConfig: MulterOptions = {
    dest: './uploads/products',
    storage: diskStorage({
        destination: (_req, _file, cb) => {
            const path = './uploads/products';
            mkdirSync(path, { recursive: true });
            cb(null, path);
        },
        filename: (req, file, cb) => {
            const requestBody = req.body;

            try {
                const productName = requestBody.product_name;
                // Check if product name is present. If it is present, check if it is a string and if it is not empty
                if (productName) {
                    if (typeof productName !== 'string') {
                        throw new BadRequestException('Product name must be a string');
                    }
                    else if (productName.trim() === '') {
                        throw new BadRequestException('Product name must not be empty');
                    }
                }
                const productDescription = requestBody.product_description;
                if (productDescription) {
                    if (typeof productDescription !== 'string') {
                        throw new BadRequestException('Product description must be a string');
                    }
                    else if (productDescription.trim() === '') {
                        throw new BadRequestException('Product description must not be empty');
                    }
                }

                const productPrice = +requestBody.product_price;
                if (productPrice) {
                    if (typeof productPrice !== 'number') {
                        throw new BadRequestException('Product price must be a number');
                    }
                    else if (productPrice <= 0) {
                        throw new BadRequestException('Product price must be a positive number');
                    }
                    else if (!Number.isInteger(productPrice)) {
                        throw new BadRequestException('Product price must be an integer');
                    }
                }

                const productCategoryId = +requestBody.product_category_id;
                if (productCategoryId) {
                    if (typeof productCategoryId !== 'number') {
                        throw new BadRequestException('Product category id must be a number');
                    }
                    else if (productCategoryId <= 0) {
                        throw new BadRequestException('Product category id must be a positive number');
                    }
                }

                if (file) {
                    const fileName = file.originalname.split(' ').join('-');
                    const fileExtension = fileName.split('.').pop();
                    const randomName = `${productName.toLowerCase()}-${Date.now()}-${Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('')}`;

                    cb(null, `${randomName}.${fileExtension}`);
                } else {
                    cb(null, '');
                }
            } catch (error) {
                cb(error, '');
            }
        },
    }),
};