import { getCategories } from '@/api/categories/get-categories.api';
import { Page } from '@/components/utility/Page';
import { ServerError } from '@/config/exceptions.config';
import type { Category } from '@/interfaces/category.interface';
import { withLayout } from '@/utils/withLayout.util';
import { withServerSideProps } from '@/utils/withServerSideProps.util';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import type { NextPage } from 'next';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { colors } from '@/styles/theme';
import { useRouter } from 'next/router';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { emojiValidationRegex } from '@/config/validation.config';
import { createCategory } from '@/api/categories/create-category.api';
import { deleteSingleCategory } from '@/api/categories/delete-single-category.api';
import { updateSingleCategory } from '@/api/categories/update-single-category.api';

const CategoriesPage: NextPage<CategoriesPageProps> = ({ categories }) => {
    // Router
    const { push } = useRouter();
    const softPageReload = () => push(window.location.href);

    // Form
    const { register: addCategoryFormRegister, setError, formState: { errors: addCategoryFormErrors }, reset: addCategoryFormReset, handleSubmit: addCategoryFormHandleSubmit } = useForm<AddCategoryFormFields>();

    // Dialogs
    const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
    function openAddCategoryDialog() {
        setIsAddCategoryDialogOpen(true);
    }
    function closeAddCategoryDialog() {
        setIsAddCategoryDialogOpen(false);
    }

    async function onAddCategory(formValues: AddCategoryFormFields) {
        const isValidEmoji = emojiValidationRegex.test(formValues.category_icon);

        if (isValidEmoji === false) {
            setError('category_icon', {
                type: 'pattern',
                message: 'Invalid icon name',
            });

            return null;
        }

        const { code, data, ok } = await createCategory({
            category_name: formValues.category_name,
            category_icon: formValues.category_icon,
        });

        if (ok === false || data === null) {
            alert(`Error while creating category. Code: ${code}`);
            return null;
        }

        alert('Category created successfully');
        addCategoryFormReset();
        closeAddCategoryDialog();
        softPageReload();
    }

    return (
        <Page title='Categories'>
            <Box
                py={3}
                component={'section'}
            >
                <Container>
                    <Box
                        component={'div'}
                        display={'flex'}
                        justifyContent={'space-between'}
                    >
                        <Typography
                            component={'h2'}
                            variant={'h2'}
                            fontWeight={'medium'}
                            textAlign={'center'}
                        >
                            List of categories
                        </Typography>
                        <Button
                            onClick={openAddCategoryDialog}
                            variant='contained'
                            startIcon={<AddIcon />}
                        >
                            Add Category
                        </Button>
                    </Box>
                    <TableContainer
                        sx={{
                            mt: 3,
                            bgcolor: colors.gray[900],
                            borderRadius: 2,
                            px: 3,
                            py: 2,
                        }}
                    >
                        <Table>
                            <TableHead
                                sx={{
                                    bgcolor: colors.gray[800],
                                    border: 0,
                                }}
                            >
                                <TableRow>
                                    <TableCell sx={{ border: 0 }} align='center'>ID</TableCell>
                                    <TableCell sx={{ border: 0 }} align='center'>Icon</TableCell>
                                    <TableCell sx={{ border: 0 }} align='center'>Name</TableCell>
                                    <TableCell sx={{ border: 0 }} align='center'>Slug</TableCell>
                                    <TableCell sx={{ border: 0 }} align='center'>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    categories.map((category) => (
                                        <CategoryRow
                                            key={category.category_id}
                                            category={category}
                                            onReload={softPageReload}
                                        />
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </Box>
            <Dialog
                open={isAddCategoryDialogOpen}
                onClose={closeAddCategoryDialog}
                sx={{
                    '& .MuiDialog-paper': {
                        width: '50%',
                        bgcolor: colors.gray[700],
                    }
                }}
            >
                <DialogTitle fontSize={24}>
                    Add Category
                </DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            rowGap: 2,
                        }}
                        component={'form'}
                        onSubmit={addCategoryFormHandleSubmit(onAddCategory)}
                    >
                        <TextField
                            fullWidth={true}
                            label='Category Name'
                            margin='dense'
                            type='text'
                            required={true}
                            placeholder='Enter category name'
                            {...addCategoryFormRegister('category_name')}
                        />
                        <TextField
                            error={addCategoryFormErrors.category_icon !== undefined}
                            helperText={addCategoryFormErrors.category_icon?.message}
                            fullWidth={true}
                            label='Category Icon'
                            margin='dense'
                            type='text'
                            required={true}
                            placeholder='Enter category icon'
                            {...addCategoryFormRegister('category_icon')}
                        />
                        <Button
                            type='submit'
                            variant='contained'
                        >
                            Add Category
                        </Button>
                    </Box>
                </DialogContent>

            </Dialog>
        </Page>
    );
};

const CategoryRow = ({ category, onReload }: { category: Category; onReload: () => void }) => {
    // Form
    const { register, setError, formState: { errors }, reset, handleSubmit } = useForm<EditCategoryFormFields>();

    // Dialog
    const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
    function openEditCategoryDialog() {
        setIsEditCategoryDialogOpen(true);
    }
    function closeEditCategoryDialog() {
        setIsEditCategoryDialogOpen(false);
    }

    async function onDeleteCategory() {
        const { code, ok } = await deleteSingleCategory(category.category_id);

        if (ok === false) {
            alert(`Error while deleting category. Code: ${code}`);
            return null;
        }

        alert('Category deleted successfully');
        onReload();
    }

    async function onEditCategory(formValues: EditCategoryFormFields) {
        const isValidEmoji = emojiValidationRegex.test(formValues.category_icon);

        if (isValidEmoji === false) {
            setError('category_icon', {
                type: 'pattern',
                message: 'Invalid icon name',
            });

            return null;
        }

        const { code, data, ok } = await updateSingleCategory(category.category_id, {
            category_name: formValues.category_name,
            category_icon: formValues.category_icon,
        });

        if (ok === false || data === null) {
            alert(`Error while updating category. Code: ${code}`);
            return null;
        }

        alert('Category updated successfully');
        reset();
        closeEditCategoryDialog();
        onReload();
    }

    return (
        <Fragment>
            <TableRow
                sx={{
                    '&:hover': {
                        bgcolor: colors.slate[800],
                        transition: 'background-color 0.1s'
                    },
                }}
            >
                <TableCell
                    sx={{
                        borderBottomColor: colors.gray[400],
                    }}
                    align='center'
                >
                    {category.category_id}</TableCell>
                <TableCell
                    sx={{
                        borderBottomColor: colors.gray[400],
                    }}
                    align='center'
                >
                    {category.category_icon}</TableCell>
                <TableCell
                    sx={{
                        borderBottomColor: colors.gray[400],
                    }}
                    align='center'
                >
                    {category.category_name}</TableCell>
                <TableCell
                    sx={{
                        borderBottomColor: colors.gray[400],
                    }}
                    align='center'
                >
                    {category.category_slug}</TableCell>
                <TableCell
                    sx={{
                        borderBottomColor: colors.gray[400],
                    }}
                    align='center'
                >
                    <IconButton
                        size='small'
                        sx={{
                            bgcolor: colors.blue[600],
                            color: colors.white,
                        }}
                        type='button'
                        onClick={openEditCategoryDialog}
                    >
                        <EditIcon/>
                    </IconButton>
                    <IconButton
                        size='small'
                        sx={{
                            bgcolor: colors.red[600],
                            color: colors.white,
                        }}
                        type='button'
                        onClick={onDeleteCategory}
                    >
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
            <Dialog
                open={isEditCategoryDialogOpen}
                onClose={closeEditCategoryDialog}
                sx={{
                    '& .MuiDialog-paper': {
                        width: '50%',
                        bgcolor: colors.gray[700],
                    }
                }}
            >
                <DialogTitle>
                    Edit Category
                </DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            rowGap: 2,
                        }}
                        component={'form'}
                        onSubmit={handleSubmit(onEditCategory)}
                    >
                        <TextField
                            defaultValue={category.category_name}
                            fullWidth={true}
                            label='Category Name'
                            margin='dense'
                            type='text'
                            required={true}
                            placeholder='Enter category name'
                            {...register('category_name')}
                        />
                        <TextField
                            defaultValue={category.category_icon}
                            error={errors.category_icon !== undefined}
                            helperText={errors?.category_icon?.message}
                            fullWidth={true}
                            label='Category Icon'
                            margin='dense'
                            type='text'
                            required={true}
                            placeholder='Enter category icon'
                            {...register('category_icon')}
                        />
                        <Button
                            type='submit'
                            variant='contained'
                        >
                            Edit Category
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Fragment>
    );
};

export const getServerSideProps = withServerSideProps<CategoriesPageProps>(async () => {
    const { code, data, ok } = await getCategories();

    if (ok === false || data === null) {
        throw new ServerError(code, 'Failed to fetch categories');
    }

    const { categories } = data;

    return {
        props: {
            categories: categories,
        }
    };
});

interface CategoriesPageProps {
    categories: Category[];
}

interface AddCategoryFormFields {
    category_name: string;
    category_icon: string;
}

interface EditCategoryFormFields {
    category_name: string;
    category_icon: string;
}

export default withLayout(CategoriesPage);