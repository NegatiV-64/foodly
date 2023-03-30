import type { CreateOrderBody, CreateOrderResponse } from '@/api/orders/createOrder.api';
import { createOrder } from '@/api/orders/createOrder.api';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Page } from '@/components/utility/Page';
import { Protected } from '@/components/utility/Protected';
import { useCart } from '@/context/cart';
import type { NextPage } from 'next';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import { CheckoutCard } from '@/components/ui/CheckoutCard';
import { moneyFormat } from '@/utils/moneyFormat.util';
import { Button } from '@/components/ui/Button';
import { useDialog } from '@/hooks/useDialog.hook';
import { Dialog } from '@/components/feedback/Dialog';
import { DialogTitle } from '@/components/feedback/DialogTitle';
import { DialogBody } from '@/components/feedback/DialogBody';
import { DialogHeader } from '@/components/feedback/DialogHeader';
import { DialogFooter } from '@/components/feedback/DialogFooter';
import { useForm } from 'react-hook-form';
import { cn } from '@/utils/cn.util';
import { getAccount } from '@/api/account/getAccount.api';
import type { Account } from '@/interfaces/account.interface';
import * as RadioGroup from '@radix-ui/react-radio-group';

const paymentMethods = [
    {
        label: 'Cash on delivery',
        value: 'cash',
    },
    {
        label: 'Card',
        value: 'card',
    }
];

const CheckoutPage: NextPage = () => {
    const { items, totalPrice } = useCart();

    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('card');
    const [orderData, setOrderData] = useState<CreateOrderResponse | null>(null);
    const [userData, setUserData] = useState<null | Pick<Account, 'user_address' | 'user_phone' | 'user_lastname' | 'user_firstname'>>(null);

    // Dialogs
    const [showErrorDialog, onOpenErrorDialog, onCloseErrorDialog] = useDialog();
    const [errorText, setErrorText] = useState<string>('');

    // Form
    const { register } = useForm();

    // Derived Values
    const showProcessToPayment = orderData === null;
    const showPaymentDetails = orderData !== null;
    const shouldRenderCheckout = items.length > 0;

    function onPaymentMethodChange(value: 'cash' | 'card') {
        setPaymentMethod(value);
    }

    async function onProcessToPayment(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        const requestBody: CreateOrderBody = {
            products: items.map((item) => ({
                product_id: item.product_id,
                quantity: item.product_quantity
            }))
        };

        const { code, data: order, error, ok } = await createOrder(requestBody);

        // If request was not successful and data is null
        if (ok === false || order === null) {
            setErrorText(`Something went wrong while creating order. Error code: ${code}. Reason: ${error}`);
            onOpenErrorDialog();
            return null;
        }

        // fetch user data
        const accountResponse = await getAccount();
        const accountData = accountResponse.data;
        if (accountResponse.ok === false || accountData === null) {
            setErrorText(`Something went wrong while fetching account data. Error code: ${accountResponse.code}. Reason: ${accountResponse.error}`);
            onOpenErrorDialog();
            return null;
        }

        setOrderData(order);
        setUserData({
            user_address: accountData.user_address,
            user_phone: accountData.user_phone,
            user_firstname: accountData.user_firstname,
            user_lastname: accountData.user_lastname
        });
    }

    const styles = {
        field: 'flex flex-col gap-y-1',
        label: 'block text-sm font-medium text-stone-900',
        input: 'block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm'
    };

    return (
        <Page title='Checkout'>
            <Protected>
                <section className='flex h-full grow flex-col py-7'>
                    <Container className='flex grow flex-col py-3'>
                        {
                            shouldRenderCheckout === true
                                ?
                                <div className='grid grid-cols-2 gap-x-4'>
                                    <div className='rounded-lg bg-white px-5 pt-4 pb-8'>
                                        <Heading className='' as='h2' size='xl'>
                                            Order Summary
                                        </Heading>
                                        <div className='mb-5 w-full'>
                                            {
                                                items.map((product) => {
                                                    return (
                                                        <CheckoutCard
                                                            key={product.product_id}
                                                            product={product}
                                                        />
                                                    );
                                                })
                                            }
                                        </div>
                                        <div className='mt-3 flex justify-between'>
                                            <Text size='lg' weight='medium'>
                                                Total:
                                            </Text>
                                            <Text size='lg' weight='medium'>
                                                {moneyFormat(totalPrice)} soms
                                            </Text>
                                        </div>
                                        {
                                            showProcessToPayment === true &&
                                            <Button type='submit' onClick={onProcessToPayment} className='mt-7 ml-auto flex'>
                                                Process to payment
                                            </Button>
                                        }
                                    </div>
                                    {
                                        showPaymentDetails === true &&
                                        <form className={cn(
                                            'rounded-lg bg-white px-5 pt-4 pb-8',
                                        )}>
                                            <div>
                                                <Heading as='h2' size='lg' weight='medium' className='text-gray-900'>
                                                    Delivery Details
                                                </Heading>
                                                <Text className='mb-2'>
                                                    <span className='text-red-500'>*</span> {' '}
                                                    Currently, we only deliver in Tashkent. Currently, we are working on expanding our delivery service.
                                                </Text>
                                                <div>
                                                    <div className='mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4'>
                                                        <div className={styles.field}>
                                                            <label htmlFor='firstname' className={styles.label}>
                                                                First Name
                                                            </label>
                                                            <input
                                                                className={styles.input}
                                                                defaultValue={userData?.user_firstname}
                                                                placeholder='Your name'
                                                                type='text'
                                                                id='name'
                                                                {...register('firstname')}
                                                            />
                                                        </div>
                                                        <div className={styles.field}>
                                                            <label htmlFor='surname' className={styles.label}>
                                                                Last Name
                                                            </label>
                                                            <input
                                                                className={styles.input}
                                                                defaultValue={userData?.user_lastname}
                                                                placeholder='Your surname'
                                                                type='text'
                                                                id='surname'
                                                                {...register('surname')}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className={cn(styles.field, 'mt-3')}>
                                                        <label className={styles.label} htmlFor='phone'>
                                                            Phone
                                                        </label>
                                                        <input
                                                            className={styles.input}
                                                            defaultValue={userData?.user_phone}
                                                            placeholder='Your phone'
                                                            type={'number'}
                                                            id='phone'
                                                            {...register('phone')}
                                                        />
                                                    </div>
                                                    <div className={cn(styles.field, 'mt-3')}>
                                                        <label htmlFor='address' className={styles.label}>
                                                            Address
                                                        </label>
                                                        <input
                                                            className={styles.input}
                                                            defaultValue={userData?.user_address}
                                                            placeholder='Your address'
                                                            type='text'
                                                            id='address'
                                                            {...register('address')}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mt-7'>
                                                <Heading as='h2' size='lg' weight='medium' className='text-gray-900'>
                                                    Payment
                                                </Heading>
                                                <div className={cn(styles.field, 'mt-3')}>
                                                    <RadioGroup.Root
                                                        className='flex flex-row gap-x-2.5'
                                                        value={paymentMethod}
                                                        name='payment_method'
                                                        onValueChange={onPaymentMethodChange}
                                                    >
                                                        {
                                                            paymentMethods.map((method) => {
                                                                return (
                                                                    <div
                                                                        className='flex items-center gap-x-1'
                                                                        key={method.value}
                                                                    >
                                                                        <RadioGroup.Item
                                                                            className='h-5 w-5 cursor-pointer rounded-full border bg-white outline-none hover:bg-gray-50 data-[state=checked]:border-transparent data-[state=checked]:bg-orange-500'
                                                                            id={method.value}
                                                                            value={method.value}
                                                                        >
                                                                            <RadioGroup.Indicator
                                                                                className="relative flex h-full w-full items-center justify-center after:block after:h-2 after:w-2 after:rounded-[50%] after:bg-white after:content-['']"
                                                                            />
                                                                        </RadioGroup.Item>
                                                                        <label
                                                                            className='text-[15px] leading-none text-stone-900'
                                                                            htmlFor={method.value}
                                                                        >
                                                                            {method.label}
                                                                        </label>
                                                                    </div>
                                                                );
                                                            })
                                                        }
                                                    </RadioGroup.Root>
                                                </div>
                                                <div className={cn(styles.field, 'mt-3')}>
                                                    <label className={styles.label} htmlFor="card-number">
                                                        Card Number
                                                    </label>
                                                    <input
                                                        className={styles.input}
                                                        type="text"
                                                        id="card-number"
                                                        autoComplete="cc-number"
                                                        {...register('card-number')}
                                                    />
                                                </div>
                                            </div>
                                            <Button className='mt-7 flex'>
                                                Confirm order
                                            </Button>
                                        </form>
                                    }
                                </div>
                                :
                                <div className='flex grow flex-col items-center pt-5'>
                                    <Text as='span' className='mb-3 text-4xl'>
                                        😢
                                    </Text>
                                    <Text size='2xl' weight='medium'>
                                        Your cart is empty {':('}
                                    </Text>
                                </div>
                        }
                    </Container>
                </section>
                <Dialog open={showErrorDialog} onClose={onCloseErrorDialog}>
                    <DialogHeader>
                        <DialogTitle>
                            Error has occurred
                        </DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <Text>
                            {errorText}
                        </Text>
                    </DialogBody>
                    <DialogFooter>
                        <Button onClick={onCloseErrorDialog}>
                            Close
                        </Button>
                    </DialogFooter>
                </Dialog>
            </Protected>
        </Page>
    );
};

export default CheckoutPage;