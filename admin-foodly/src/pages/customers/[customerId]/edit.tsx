import { getSingleCustomer } from '@/api/customers/get-single-customer.api';
import type { UpdateSingleCustomerBody} from '@/api/customers/update-single-customer.api';
import { updateSingleCustomer } from '@/api/customers/update-single-customer.api';
import { Page } from '@/components/utility/Page';
import { ServerError } from '@/config/exceptions.config';
import type { User } from '@/interfaces/user.interface';
import { validateQueryParam } from '@/utils/validate-query-param.util';
import { withLayout } from '@/utils/withLayout.util';
import { withServerSideProps } from '@/utils/withServerSideProps.util';
import { Box, Button, Checkbox, Container, FormControlLabel, TextField, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

const EditCustomerPage: NextPage<EditCustomerPageProps> = ({ customer }) => {
    // Router
    const { push } = useRouter();

    // Form
    const { register, handleSubmit } = useForm<EditCustomerPageFormFields>();

    // Handlers
    async function onSubmit(formValues: EditCustomerPageFormFields) {
        const requestBody: UpdateSingleCustomerBody = {};

        if (formValues.firstname && formValues.firstname.length > 0 && formValues.firstname !== customer.user_firstname) {
            requestBody.firstname = formValues.firstname;
        }

        if (formValues.lastname && formValues.lastname.length > 0 && formValues.lastname !== customer.user_lastname) {
            requestBody.lastname = formValues.lastname;
        }

        if (formValues.email && formValues.email.length > 0 && formValues.email.includes('@') && formValues.email !== customer.user_email) {
            requestBody.email = formValues.email;
        }

        if (formValues.phone && formValues.phone.length > 0 && formValues.phone !== customer.user_phone) {
            requestBody.phone = formValues.phone;
        }

        if (formValues.address && formValues.address.length > 0 && formValues.address !== customer.user_address) {
            requestBody.address = formValues.address;
        }

        if (formValues.password && formValues.password.length > 5 && formValues.password === formValues.confirmPassword) {
            requestBody.password = formValues.password;
        }

        if (formValues.isVerified !== customer.user_is_verified) {
            requestBody.is_verified = formValues.isVerified;
        }

        const { code, ok } = await updateSingleCustomer(customer.user_id, requestBody);

        if (ok === false) {
            alert(`Error updating customer: ${code}`);

            return null;
        }

        push(`/customers/${customer.user_id}`);
    }

    return (
        <Page title={`Editing customer #${customer.user_id}`}>
            <Box
                component={'section'}
                py={3}
            >
                <Container>
                    <Typography
                        variant={'h2'}
                        component={'h2'}
                        mb={3}
                        textAlign={'center'}
                    >
                        Updating customer #{customer.user_id}
                    </Typography>
                    <Box
                        onSubmit={handleSubmit(onSubmit)}
                        display={'flex'}
                        flexDirection={'column'}
                        rowGap={2}
                        component={'form'}
                    >
                        <TextField
                            label={'First name'}
                            type='text'
                            defaultValue={customer.user_firstname ?? ''}
                            fullWidth={true}
                            variant={'outlined'}
                            margin={'dense'}
                            {...register('firstname')}
                        />
                        <TextField
                            label={'Last name'}
                            type='text'
                            defaultValue={customer.user_lastname ?? ''}
                            fullWidth={true}
                            variant={'outlined'}
                            margin={'dense'}
                            {...register('lastname')}
                        />
                        <TextField
                            label={'Email'}
                            type='email'
                            defaultValue={customer.user_email ?? ''}
                            fullWidth={true}
                            variant={'outlined'}
                            margin={'dense'}
                            {...register('email')}
                        />
                        <TextField
                            label={'Phone'}
                            type='tel'
                            defaultValue={customer.user_phone ?? ''}
                            fullWidth={true}
                            variant={'outlined'}
                            margin={'dense'}
                            {...register('phone')}
                        />
                        <TextField
                            label={'Address'}
                            defaultValue={customer.user_address ?? ''}
                            fullWidth={true}
                            variant={'outlined'}
                            margin={'dense'}
                            {...register('address')}
                        />
                        <TextField
                            label={'Password'}
                            type='password'
                            fullWidth={true}
                            variant={'outlined'}
                            {...register('password')}
                        />
                        <TextField
                            label={'Confirm password'}
                            type='password'
                            fullWidth={true}
                            variant={'outlined'}
                            {...register('confirmPassword')}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    defaultChecked={customer.user_is_verified}
                                    {...register('isVerified')}
                                />
                            }
                            sx={{
                                ml: 0,
                                justifyContent: 'start',
                            }}
                            label={'Is verified'}
                            labelPlacement='start'
                        />
                        <Button
                            type={'submit'}
                            variant={'contained'}
                            sx={{
                                width: 'fit-content',
                            }}
                        >
                            Update customer
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Page>
    );
};

export const getServerSideProps = withServerSideProps<EditCustomerPageProps>(async (context) => {
    const customerId = validateQueryParam(context.params?.customerId, 'number');
    if (!customerId) {
        return {
            notFound: true,
        };
    }

    const { code, data, ok } = await getSingleCustomer(customerId, context);

    if (ok === false || data === null) {
        throw new ServerError(code, 'Error fetching customer');
    }

    return {
        props: {
            customer: {
                user_address: data.user_address,
                user_email: data.user_email,
                user_id: data.user_id,
                user_firstname: data.user_firstname,
                user_is_verified: data.user_is_verified,
                user_lastname: data.user_lastname,
                user_phone: data.user_phone,
                user_type: data.user_type,
            },
        },
    };
});

interface EditCustomerPageProps {
    customer: User;
}

interface EditCustomerPageFormFields {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    confirmPassword: string;
    isVerified: boolean;
}

export default withLayout(EditCustomerPage);