import { getAccount } from '@/api/account/getAccount.api';
import type { UpdateAccountBody } from '@/api/account/updateAccount.api';
import { updateAccount } from '@/api/account/updateAccount.api';
import { Dialog } from '@/components/feedback/Dialog';
import { DialogBody } from '@/components/feedback/DialogBody';
import { DialogFooter } from '@/components/feedback/DialogFooter';
import { DialogHeader } from '@/components/feedback/DialogHeader';
import { DialogTitle } from '@/components/feedback/DialogTitle';
import { InputField } from '@/components/form/InputField';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { Text } from '@/components/ui/Text';
import { Page } from '@/components/utility/Page';
import { Protected } from '@/components/utility/Protected';
import { ServerError } from '@/exceptions/server-error.exception';
import { useDialog } from '@/hooks/useDialog.hook';
import type { Account } from '@/types/account.types';
import { moneyFormat } from '@/utils/money-format.util';
import { Time } from '@/utils/time.util';
import { withServerSideProps } from '@/utils/with-server-side-props.util';
import type { NextPage } from 'next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiOutlineSave } from 'react-icons/hi';

const AccountPage: NextPage<AccountPageProps> = ({ account }) => {
    const [accountData, setAccountData] = useState<Account>(account);

    // ==== Form ==== //
    const { register, handleSubmit } = useForm<AccountPageFormFields>();

    // ==== Dialogs ==== //
    const [showErrorDialog, openErrorDialog, closeErrorDialog] = useDialog(false);
    const [errorDialogMessage, setErrorDialogMessage] = useState<string>('');
    const [showSuccessDialog, openSuccessDialog, closeSuccessDialog] = useDialog(false);

    async function onUpdateAccountData(data: AccountPageFormFields) {
        const requestBody: UpdateAccountBody = {
            user_email: data.email,
            user_phone: data.phone,
        };
        if (data.first_name) {
            requestBody.user_firstname = data.first_name;
        }
        if (data.last_name) {
            requestBody.user_lastname = data.last_name;
        }
        if (data.address) {
            requestBody.user_address = data.address;
        }

        const { code, data: response, error: responseError, ok } = await updateAccount(requestBody);

        if (ok === false || response === null) {
            openErrorDialog();
            setErrorDialogMessage(`${code}: ${JSON.stringify(responseError)}`);
            return null;
        }

        openSuccessDialog();
        setAccountData((prevData) => {
            return {
                ...prevData,
                user_email: response.user_email,
                user_phone: response.user_phone,
                user_firstname: response.user_firstname,
                user_lastname: response.user_lastname,
                user_address: response.user_address,
            };
        });
    }

    return (
        <Protected>
            <Page title='Viewing account'>
                <Section className='flex h-full grow flex-col'>
                    <Container className='grid grow grid-cols-2 flex-col gap-x-5 py-3'>
                        <div>
                            <Heading>
                                Your account
                            </Heading>
                            <form
                                onSubmit={handleSubmit(onUpdateAccountData)}
                                className='mt-4 flex flex-col gap-y-3 rounded-lg bg-white px-5 pt-2 pb-6'
                            >
                                <div className='mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4'>
                                    <InputField
                                        label='First name'
                                        id='first_name'
                                        type='text'
                                        formFieldProps={{
                                            hasSpacing: false
                                        }}
                                        defaultValue={accountData.user_firstname ?? ''}
                                        {...register('first_name')}
                                    />
                                    <InputField
                                        label='Last name'
                                        formFieldProps={{
                                            hasSpacing: false
                                        }}
                                        id='last_name'
                                        type='text'
                                        defaultValue={accountData.user_lastname ?? ''}
                                        {...register('last_name')}
                                    />
                                </div>
                                <InputField
                                    label='Email'
                                    id='email'
                                    type='email'
                                    required={true}
                                    defaultValue={accountData.user_email}
                                    {...register('email')}
                                />
                                <InputField
                                    label='Phone'
                                    id='phone'
                                    required={true}
                                    type='tel'
                                    defaultValue={accountData.user_phone}
                                    {...register('phone')}
                                />
                                <InputField
                                    label='Address'
                                    id='address'
                                    type='text'
                                    defaultValue={accountData.user_address ?? ''}
                                    {...register('address')}
                                />
                                <Button
                                    className='mt-4 w-fit'
                                    size={'small'}
                                    startIcon={<HiOutlineSave />}
                                    type='submit'
                                >
                                    Update account
                                </Button>
                            </form>
                        </div>
                        <div>
                            <Heading>
                                Your orders
                            </Heading>
                            <div className='mt-4 rounded-lg bg-white px-5 pt-2 pb-6'>
                                {
                                    accountData.order.length > 0
                                        ?
                                        <table className='table-fixed'>
                                            {
                                                accountData.order.map((order, index) => (
                                                    <tr className='border' key={order.order_id}>
                                                        <td className='border-r py-1 px-2'>{index + 1}</td>
                                                        <td className='border-r py-1 px-2'>{Time(order.order_created_at).format('DD/MM/YYYY HH:mm')}</td>
                                                        <td className='border-r py-1 px-2'>{order.order_status}</td>
                                                        <td className='py-1 px-2'>{moneyFormat(order.order_price)} soms</td>
                                                    </tr>
                                                ))
                                            }
                                        </table>
                                        :
                                        <p>You have no orders</p>
                                }
                            </div>
                            <Heading>
                                Your payments
                            </Heading>
                            <div className='mt-4 rounded-lg bg-white px-5 pt-2 pb-6'>
                                {
                                    accountData.payment.length > 0
                                        ?
                                        <table className='table-fixed'>
                                            {
                                                accountData.payment.map((payment, index) => (
                                                    <tr className='border' key={payment.payment_id}>
                                                        <td className='border-r py-1 px-2'>{index + 1}</td>
                                                        <td className='border-r py-1 px-2'>{Time(payment.payment_date).format('DD/MM/YYYY HH:mm')}</td>
                                                        <td className='border-r py-1 px-2'>{payment.payment_type}</td>
                                                    </tr>
                                                ))
                                            }
                                        </table>
                                        :
                                        <p>You have no payments</p>
                                }
                            </div>
                        </div>
                    </Container>
                </Section>
                <Dialog
                    open={showErrorDialog}
                    onClose={closeErrorDialog}
                >
                    <DialogHeader>
                        <DialogTitle>
                            Error on updating account
                        </DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <Text>
                            {errorDialogMessage}
                        </Text>
                    </DialogBody>
                    <DialogFooter>
                        <Button
                            onClick={closeErrorDialog}
                            size={'small'}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </Dialog>
                <Dialog
                    open={showSuccessDialog}
                    onClose={closeSuccessDialog}
                >
                    <DialogHeader>
                        <DialogTitle>
                            Account updated
                        </DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <Text>
                            Your account has been updated successfully
                        </Text>
                    </DialogBody>
                    <DialogFooter>
                        <Button
                            onClick={closeSuccessDialog}
                            size={'small'}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </Dialog>
            </Page>
        </Protected>
    );
};

export const getServerSideProps = withServerSideProps<AccountPageProps>(async (context) => {
    const account = await getAccount(context);

    if (account.ok === false || account.data === null) {
        throw new ServerError(account.code, 'Error happened while getting account data');
    }

    return {
        props: {
            account: account.data,
        }
    };
});

interface AccountPageProps {
    account: Account;
}

interface AccountPageFormFields {
    first_name?: string;
    last_name?: string;
    email: string;
    phone: string;
    address?: string;
}

export default AccountPage;