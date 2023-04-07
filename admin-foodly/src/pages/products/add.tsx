import { getCategories } from '@/api/categories/get-categories.api';
import { Page } from '@/components/utility/Page';
import { ServerError } from '@/config/exceptions.config';
import type { Category } from '@/interfaces/category.interface';
import { colors } from '@/styles/theme';
import { withLayout } from '@/utils/withLayout.util';
import type { WithServerSideProps } from '@/utils/withServerSideProps.util';
import { withServerSideProps } from '@/utils/withServerSideProps.util';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import type { CreateProductBody } from '@/api/products/create-product.api';
import { createProduct } from '@/api/products/create-product.api';

const AddProductPage: NextPage<AddProductPageProps> = ({ categories }) => {
    const categoriesOptions = categories.map(category => ({
        value: `${category.category_id}`,
        label: `${category.category_name}`,
    }));

    const { register, handleSubmit, reset } = useForm<AddProductPageFormFields>();

    async function onSubmitForm(data: AddProductPageFormFields) {
        // Get the image file
        const imageFile = data.product_image[0];

        // Check if product price is a valid number
        if (isNaN(data.product_price)) {
            alert('Product price must be a valid number');
            return null;
        }

        const requestBody: CreateProductBody = {
            product_name: data.product_name,
            product_description: data.product_description,
            product_category_id: +data.product_category_id,
            product_price: +data.product_price,
            product_image: imageFile,
        };

        const { code, data: isCreated, ok } = await createProduct(requestBody);

        if (ok === false || isCreated === null) {
            alert(`Failed to create product. Code: ${code}`);
        }

        alert('Product created successfully');

        reset();
    }

    return (
        <Page title='Add Product'>
            <Box
                py={3}
                component={'section'}
            >
                <Container>
                    <Typography
                        textAlign={'center'}
                        variant='h2'
                        component='h2'
                        fontWeight={'medium'}
                        mb={2}
                    >
                        Add Product
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
                            {...register('product_image', {
                                required: true,

                            })}
                            required={true}
                        />
                        <TextField
                            label='Name'
                            variant='outlined'
                            fullWidth={true}
                            margin='dense'
                            type='text'
                            placeholder='Enter product name'
                            {...register('product_name')}
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
                                defaultValue={''}
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
                            Add Product
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Page>
    );
};

export const getServerSideProps: WithServerSideProps<AddProductPageProps> = withServerSideProps(async () => {
    const categoriesResponse = await getCategories();

    if (categoriesResponse.ok === false || categoriesResponse.data === null) {
        throw new ServerError(categoriesResponse.code, 'Failed to fetch categories');
    }

    return {
        props: {
            categories: categoriesResponse.data.categories,
        }
    };
});

interface AddProductPageProps {
    categories: Category[];
}

interface AddProductPageFormFields {
    product_name: string;
    product_description: string;
    product_price: number;
    product_category_id: number;
    product_image: FileList;
}

export default withLayout(AddProductPage);