import { BadRequestException } from '@nestjs/common';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';

export const createProductUploadConfig: MulterOptions = {
    dest: './upload/products',
    storage: diskStorage({
        destination: (_req, _file, cb) => {
            const path = './upload/products';
            mkdirSync(path, { recursive: true });
            cb(null, './upload/products');
        },
        filename: (req, file, cb) => {
            const requestBody = req.body;

            try {
                const productName = requestBody.product_name;
                if (!productName || typeof productName !== 'string' || productName.trim() === '') {
                    let errorMessage = 'Product name is required';

                    if (typeof productName !== 'string') {
                        errorMessage = 'Product name must be a string';
                    }
                    else if (productName.trim() === '') {
                        errorMessage = 'Product name must not be empty';
                    }

                    throw new BadRequestException(errorMessage);
                }

                const productDescription = requestBody.product_description;
                if (!productDescription || typeof productDescription !== 'string' || productDescription.trim() === '') {
                    let errorMessage = 'Product description is required';

                    if (typeof productDescription !== 'string') {
                        errorMessage = 'Product description must be a string';
                    }
                    else if (productDescription.trim() === '') {
                        errorMessage = 'Product description must not be empty';
                    }

                    throw new BadRequestException(errorMessage);
                }

                const productPrice = +requestBody.product_price;
                if (!productPrice || typeof productPrice !== 'number' || productPrice <= 0 || !Number.isInteger(productPrice)) {
                    let errorMessage = 'Product price is required';
                    if (typeof productPrice !== 'number') {
                        errorMessage = 'Product price must be a number';
                    }
                    else if (productPrice <= 0) {
                        errorMessage = 'Product price must be a positive number';
                    }
                    else if (!Number.isInteger(productPrice)) {
                        errorMessage = 'Product price must be an integer';
                    }

                    throw new BadRequestException(errorMessage);
                }

                const productCategoryId = +requestBody.product_category_id;
                // Check if product category id is present and if it is a number and if it is positive and if it is an integer
                if (!productCategoryId || typeof productCategoryId !== 'number' || productCategoryId <= 0 || !Number.isInteger(productCategoryId)) {
                    let errorMessage = 'Product category id is required';

                    // If it is not a number, throw BadRequestException
                    if (typeof productCategoryId !== 'number') {
                        errorMessage = 'Product category id must be a number';
                    }
                    // If it is not positive, throw BadRequestException
                    else if (productCategoryId <= 0) {
                        errorMessage = 'Product category id must be a positive number';
                    }

                    throw new BadRequestException(errorMessage);
                }

                const fileName = file.originalname.split(' ').join('-');
                const fileExtension = fileName.split('.').pop();
                const randomName = `${productName.toLowerCase()}-${Date.now()}-${Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('')}`;

                cb(null, `${randomName}.${fileExtension}`);
            } catch (error) {
                cb(error, '');
            }
        },
    }),
};