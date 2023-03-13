// Create a Checkout page component with type NextPage

import { Page } from '@/components/utility/Page';
import type { NextPage } from 'next';

const CheckoutPage: NextPage = () => {
    return (
        <Page title='Checkout'>
            <h1>Checkout</h1>
        </Page>
    );
};

export default CheckoutPage;