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
import { moneyFormat } from '@/utils/money-format.util';
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
import type { Account } from '@/types/account.types';
import * as RadioGroup from '@radix-ui/react-radio-group';
import type { CreatePaymentBody } from '@/api/payments/createPayment.api';
import { createPayment } from '@/api/payments/createPayment.api';
import { createDelivery } from '@/api/deliveries/createDelivery.api';
import { useRouter } from 'next/router';
import { RoutesConfig } from '@/config/routes.config';

// A little note about the form:
// I know that that in real production app, for handling address
// we should use some kind of address picker that uses geolocation
// and some API to fetch/autocomplete addresses. But I don't have
// time to implement it. If you really want to implement such kind of
// functionality, I recommend using Nominatim API (https://nominatim.org/release-docs/develop/)
// It is free and doesn't require any API keys. It is used by OpenStreetMap and you
// can mix it with Leaflet to create a map with address input and autocomplete.

const paymentMethods = [
    {
        label: 'Cash on delivery',
        value: 'CASH',
    },
    {
        label: 'Card',
        value: 'CREDIT',
    }
];

const CheckoutPage: NextPage = () => {
    // Contexts
    const { items, totalPrice, clearCart } = useCart();

    // Router
    const { push } = useRouter();

    // States
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CREDIT'>('CREDIT');
    const [orderData, setOrderData] = useState<CreateOrderResponse | null>(null);
    const [userData, setUserData] = useState<null | Pick<Account, 'user_address' | 'user_phone' | 'user_lastname' | 'user_firstname'>>(null);

    // Dialogs
    const [showErrorDialog, onOpenErrorDialog, onCloseErrorDialog] = useDialog();
    const [errorText, setErrorText] = useState<string>('');
    const [showSuccessDialog, onOpenSuccessDialog, onCloseSuccessDialog] = useDialog();

    // Form
    const { register, handleSubmit } = useForm<SaveDeliveryAndPaymentFormFields>();

    // Derived Values
    const showProcessToPayment = orderData === null;
    const showPaymentDetails = orderData !== null;
    const shouldRenderCheckout = items.length > 0;

    function onPaymentMethodChange(value: 'CASH' | 'CREDIT') {
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

    async function onSaveDeliveryAndPayment(data: SaveDeliveryAndPaymentFormFields) {
        console.log(data);
        if (orderData === null) {
            setErrorText('Something went wrong while creating order. Please try again later.');
            onOpenErrorDialog();
            return null;
        }

        if (userData === null) {
            setErrorText('Something went wrong while fetching account data. Please try again later.');
            onOpenErrorDialog();
            return null;
        }

        const paymentRequestBody: CreatePaymentBody = {
            order_id: orderData.order_id,
            payment_type: paymentMethod,
        };

        if (paymentMethod === 'CREDIT') {
            if (data.card_number === undefined) {
                setErrorText('Please enter card number');
                onOpenErrorDialog();
                return null;
            }

            paymentRequestBody.payment_credit_card = data.card_number;
        }

        const createPaymentResponse = await createPayment(paymentRequestBody);
        if (createPaymentResponse.ok === false || createPaymentResponse.data === null) {
            setErrorText(`Something went wrong while creating payment. Error code: ${createPaymentResponse.code}. Reason: ${createPaymentResponse.error}`);
            onOpenErrorDialog();
            return null;
        }

        // Create delivery
        const createDeliveryResponse = await createDelivery({
            order_id: orderData.order_id,
            delivery_address: data.address,
            delivery_charge: 10_000,
        });

        if (createDeliveryResponse.ok === false || createDeliveryResponse.data === null) {
            setErrorText(`Something went wrong while creating delivery. Error code: ${createDeliveryResponse.code}. Reason: ${createDeliveryResponse.error}`);
            onOpenErrorDialog();
            return null;
        }

        onOpenSuccessDialog();
    }

    const styles = {
        field: 'flex flex-col gap-y-1',
        label: 'block text-sm font-medium text-stone-900',
        required: 'text-red-500',
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
                                        <form
                                            onSubmit={handleSubmit(onSaveDeliveryAndPayment)}
                                            className={cn(
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
                                                                First Name {' '} <span className={styles.required}>*</span>
                                                            </label>
                                                            <input
                                                                required={true}
                                                                className={styles.input}
                                                                disabled={userData?.user_firstname !== null}
                                                                defaultValue={userData?.user_firstname ?? ''}
                                                                placeholder='Your first name'
                                                                type='text'
                                                                id='name'
                                                                {...register('firstname')}
                                                            />
                                                        </div>
                                                        <div className={styles.field}>
                                                            <label htmlFor='lastname' className={styles.label}>
                                                                Last Name {' '} <span className={styles.required}>*</span>
                                                            </label>
                                                            <input
                                                                required={true}
                                                                className={styles.input}
                                                                disabled={userData?.user_lastname !== null}
                                                                defaultValue={userData?.user_lastname ?? ''}
                                                                placeholder='Your last name'
                                                                type='text'
                                                                id='lastname'
                                                                {...register('lastname')}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className={cn(styles.field, 'mt-3')}>
                                                        <label htmlFor='address' className={styles.label}>
                                                            Address {' '} <span className={styles.required}>*</span>
                                                        </label>
                                                        <input
                                                            required={true}
                                                            className={styles.input}
                                                            defaultValue={userData?.user_address ?? ''}
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
                                                {
                                                    paymentMethod === 'CREDIT' &&
                                                    <div className={cn(styles.field, 'mt-3')}>
                                                        <label className={styles.label} htmlFor="card_number">
                                                            Card Number
                                                        </label>
                                                        <input
                                                            className={styles.input}
                                                            type="text"
                                                            id="card_number"
                                                            autoComplete="cc-number"
                                                            {...register('card_number')}
                                                        />
                                                    </div>
                                                }
                                            </div>
                                            <Button type='submit' className='mt-7 flex'>
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
                <Dialog
                    open={showSuccessDialog}
                    onClose={onCloseSuccessDialog}
                >
                    <DialogHeader>
                        <DialogTitle>
                            Order has been placed successfully
                        </DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <Text className='text-center'>
                            Your order has been placed successfully. Delivery will be made within next hour. Thank you for choosing us.
                        </Text>
                    </DialogBody>
                    <DialogFooter className='flex justify-center'>
                        <Button
                            className='w-fit'
                            onClick={() => {
                                onCloseSuccessDialog();
                                clearCart();
                                push(RoutesConfig.Home);
                            }}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </Dialog>
            </Protected>
        </Page>
    );
};

interface SaveDeliveryAndPaymentFormFields {
    firstname: string;
    lastname: string;
    phone: string;
    address: string;
    card_number?: string;
}

export default CheckoutPage;