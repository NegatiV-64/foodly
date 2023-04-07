import { getCategories } from '@/api/categories/get-categories.api';
import { getSingleProduct } from '@/api/products/get-single-product.api';
import type { UpdateSingleProductBody} from '@/api/products/update-single-product.api';
import { updateSingleProduct } from '@/api/products/update-single-product.api';
import { Page } from '@/components/utility/Page';
import { ServerError } from '@/config/exceptions.config';
import type { Category } from '@/interfaces/category.interface';
import type { Product } from '@/interfaces/product.interface';
import { colors } from '@/styles/theme';
import { validateQueryParam } from '@/utils/validate-query-param.util';
import { withLayout } from '@/utils/withLayout.util';
import { withServerSideProps } from '@/utils/withServerSideProps.util';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

const EditProductPage: NextPage<EditProductPageProps> = ({ categories, product }) => {
    const categoriesOptions = categories.map(category => ({
        value: `${category.category_id}`,
        label: `${category.category_name}`,
    }));

    const { register, handleSubmit } = useForm<EditProductPageFormFields>();
    const { push } = useRouter();


    async function onSubmitForm(data: EditProductPageFormFields) {
        const imageFile = data.product_image && data.product_image.length > 0 ? data.product_image[0] : null;

        // Check if product price is a valid number
        if (isNaN(data.product_price)) {
            alert('Product price must be a valid number');
            return null;
        }

        const requestBody: UpdateSingleProductBody = {
            product_category_id: +data.product_category_id,
            product_name: data.product_name,
            product_description: data.product_description,
            product_price: +data.product_price,
        };

        if (imageFile) {
            requestBody.product_image = imageFile;
        }

        const { code, data: isUpdated, ok } = await updateSingleProduct(product.product_id, requestBody);

        if (ok === false || isUpdated === null) {
            alert(`Failed to update product. Code: ${code}`);
        }

        alert('Product updated successfully');

        push(`/products/${product.product_id}`);
    }

    return (
        <Page title={`Editing ${product.product_name}`}>
            <Box
                component={'section'}
                py={3}
            >
                <Container>
                    <Typography
                        textAlign={'center'}
                        variant='h2'
                        component='h2'
                        fontWeight={'medium'}
                        mb={2}
                    >
                        Edit product
                    </Typography>
                    <Box
                        onSubmit={handleSubmit(onSubmitForm)}
                        component={'form'}
                    >
                        <TextField
                            variant='outlined'
                            fullWidth={true}
                            margin='dense'
                            placeholder='Upload product image'
                            type='file'
                            {...register('product_image')}
                        />
                        <TextField
                            label='Name'
                            variant='outlined'
                            fullWidth={true}
                            margin='dense'
                            type='text'
                            placeholder='Enter product name'
                            {...register('product_name')}
                            defaultValue={product.product_name}
                            required={true}
                        />
                        <TextField
                            label='Description'
                            variant='outlined'
                            placeholder='Enter product description'
                            fullWidth={true}
                            margin='dense'
                            minRows={2}
                            multiline={true}
                            type='text'
                            {...register('product_description')}
                            defaultValue={product.product_description}
                            required={true}
                        />
                        <TextField
                            inputMode='numeric'
                            label='Price'
                            placeholder='Enter product price'
                            variant='outlined'
                            fullWidth={true}
                            margin='dense'
                            {...register('product_price', {
                                pattern: new RegExp(/^[0-9]+$/),
                            })}
                            defaultValue={product.product_price}
                            required={true}
                        />
                        <FormControl
                            sx={{
                                mt: 1,
                                mb: '4px',
                            }}
                            fullWidth={true}
                        >
                            <InputLabel id='product_category_id'>
                                Category
                            </InputLabel>
                            <Select
                                label='Category'
                                labelId='product_category_id'
                                variant='outlined'
                                fullWidth={true}
                                margin='dense'
                                defaultValue={`${product.product_category_id}`}
                                {...register('product_category_id')}
                                required={true}
                                placeholder='Select product category'
                                sx={{
                                    color: colors.white,
                                    bgcolor: colors.transparent,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: colors.gray[500],
                                        transition: '0.2s',
                                        borderWidth: '1px'
                                    },
                                    '& .MuiSelect-icon': {
                                        color: colors.white,
                                    },
                                    '& .MuiOutlinedInput-notchedOutline.Mui-focused': {
                                        borderColor: colors.forest[500],
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: colors.gray[300],
                                    },
                                }}
                                MenuProps={{
                                    sx: {
                                        '& .MuiPaper-root': {
                                            bgcolor: colors.gray[900],
                                            color: colors.gray[100],
                                        },
                                        // on hover
                                        '& .MuiMenuItem-root': {
                                            '&:hover': {
                                                bgcolor: colors.forest[600],
                                            }
                                        }
                                    }
                                }}
                            >
                                {categoriesOptions.map(category => (
                                    <MenuItem value={category.value} key={category.value}>
                                        {category.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            sx={{
                                mt: 3,
                            }}
                            type='submit'
                            variant='contained'
                        >
                            Update Product
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Page>
    );
};

export const getServerSideProps = withServerSideProps<EditProductPageProps>(async (context) => {
    const productId = validateQueryParam(context.query.productId, 'number');

    if (productId === null) {
        return {
            notFound: true,
        };
    }

    // Asynchronously fetch the product and categories
    const [productResponse, categoriesResponse] = await Promise.all([
        getSingleProduct(productId),
        getCategories(),
    ]);

    if (productResponse.ok === false || productResponse.data === null) {
        throw new ServerError(productResponse.code, 'Failed to get product');
    }
    if (categoriesResponse.ok === false || categoriesResponse.data === null) {
        throw new ServerError(categoriesResponse.code, 'Failed to get categories');
    }

    const product = productResponse.data;
    const categories = categoriesResponse.data.categories;


    return {
        props: {
            product: product,
            categories: categories,
        },
    };
});

interface EditProductPageProps {
    product: Product;
    categories: Category[];
}

interface EditProductPageFormFields {
    product_name: string;
    product_description: string;
    product_price: number;
    product_category_id: number;
    product_image: FileList;
}

export default withLayout(EditProductPage);