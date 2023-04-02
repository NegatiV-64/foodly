import { getAccount } from '@/api/account/getAccount.api';
import type { UpdateAccountBody } from '@/api/account/updateAccount.api';
import { updateAccount } from '@/api/account/updateAccount.api';
import { Dialog } from '@/components/feedback/Dialog';
import { DialogBody } from '@/components/feedback/DialogBody';
import { DialogFooter } from '@/components/feedback/DialogFooter';
import { DialogHeader } from '@/components/feedback/DialogHeader';
import { DialogTitle } from '@/components/feedback/DialogTitle';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Page } from '@/components/utility/Page';
import { Protected } from '@/components/utility/Protected';
import { useDialog } from '@/hooks/useDialog.hook';
import type { Account } from '@/interfaces/account.interface';
import { cn } from '@/utils/cn.util';
import { moneyFormat } from '@/utils/moneyFormat.util';
import { parseDate } from '@/utils/parseDate.util';
import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiOutlineSave } from 'react-icons/hi';

const AccountPage: NextPage = () => {
    // Form
    const { register, handleSubmit } = useForm<AccountPageFormFields>();

    // Dialogs
    const [showErrorDialog, openErrorDialog, closeErrorDialog] = useDialog(false);
    const [errorDialogMessage, setErrorDialogMessage] = useState<string>('');
    const [showSuccessDialog, openSuccessDialog, closeSuccessDialog] = useDialog(false);

    // Fetch account data
    const [accountData, setAccountData] = useState<Account | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const fetchAccountData = useCallback(async () => {
        setLoading(true);
        try {
            const { code, data, error: responseError, ok } = await getAccount();
            if (ok === false || data === null) {
                throw new Error(`${code}: ${JSON.stringify(responseError)}`);
            }
            setAccountData(data);
        } catch (err) {
            setError(true);
            if (err instanceof Error) {
                setErrorDialogMessage(err.message);
            } else {
                setErrorDialogMessage('An unknown error occurred while getting your account data');
            }
            openErrorDialog();
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        fetchAccountData();
    }, [fetchAccountData]);

    // Update account data
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
            if (prevData === null) {
                return null;
            }

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

    const styles = {
        field: 'flex flex-col gap-y-1',
        label: 'block text-sm font-medium text-stone-900',
        required: 'text-red-500',
        input: 'block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm'
    };

    return (
        <Protected>
            <Page title='Viewing account'>
                <section className='flex h-full grow flex-col py-7'>
                    {
                        loading === true && (
                            <p>Loading...</p>
                        )
                    }
                    {
                        error === true && (
                            <p>{error}</p>
                        )
                    }
                    {
                        accountData !== null && loading === false && error === false && (
                            <Container className='grid grow grid-cols-2 flex-col gap-x-5 py-3'>
                                <div>
                                    <Heading>
                                        Your account
                                    </Heading>
                                    <form
                                        onSubmit={handleSubmit(onUpdateAccountData)}
                                        className='mt-4 rounded-lg bg-white px-5 pt-2 pb-6'
                                    >
                                        <div className='mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4'>
                                            <div className={styles.field}>
                                                <label
                                                    className={styles.label}
                                                    htmlFor='first_name'
                                                >
                                                    First name
                                                </label>
                                                <input
                                                    className={styles.input}
                                                    type='text'
                                                    id='first_name'
                                                    {...register('first_name')}
                                                    defaultValue={accountData.user_firstname ?? ''}
                                                />
                                            </div>
                                            <div className={styles.field}>
                                                <label
                                                    className={styles.label}
                                                    htmlFor='last_name'
                                                >
                                                    Last name
                                                </label>
                                                <input
                                                    className={styles.input}
                                                    type='text'
                                                    id='last_name'
                                                    {...register('last_name')}
                                                    defaultValue={accountData.user_lastname ?? ''}
                                                />
                                            </div>
                                        </div>
                                        <div className={cn(styles.field, 'mt-3')}>
                                            <label
                                                className={styles.label}
                                                htmlFor='email'
                                            >
                                                Email<span className={styles.required}>*</span>
                                            </label>
                                            <input
                                                required={true}
                                                className={styles.input}
                                                type='email'
                                                id='email'
                                                {...register('email')}
                                                defaultValue={accountData.user_email}
                                            />
                                        </div>
                                        <div className={cn(styles.field, 'mt-3')}>
                                            <label
                                                className={styles.label}
                                                htmlFor='phone'
                                            >
                                                Phone<span className={styles.required}>*</span>
                                            </label>
                                            <input
                                                className={styles.input}
                                                type='tel'
                                                id='phone'
                                                {...register('phone')}
                                                name='phone'
                                                defaultValue={accountData.user_phone}
                                            />
                                        </div>
                                        <div className={cn(styles.field, 'mt-3')}>
                                            <label
                                                className={styles.label}
                                                htmlFor='address'
                                            >
                                                Address
                                            </label>
                                            <input
                                                {...register('address')}
                                                className={styles.input}
                                                type='text'
                                                id='address'
                                                name='address'
                                                defaultValue={accountData.user_address ?? ''}
                                            />
                                        </div>
                                        <Button
                                            className='mt-4'
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
                                                                <td className='border-r py-1 px-2'>{parseDate(order.order_created_at).format('DD/MM/YYYY HH:mm')}</td>
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
                                                                <td className='border-r py-1 px-2'>{parseDate(payment.payment_date).format('DD/MM/YYYY HH:mm')}</td>
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
                        )
                    }
                </section>
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

interface AccountPageFormFields {
    first_name?: string;
    last_name?: string;
    email: string;
    phone: string;
    address?: string;
}

export default AccountPage;