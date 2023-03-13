import { Fragment } from 'react';
import type { FC } from 'react';
import type { AppProps } from 'next/app';
import '@/styles/root.css';
import '@/styles/tailwind.css';
import { Layout } from '@/layout';
import Head from 'next/head';
import { CartProvider } from '@/context/cart';
import { AuthProvider } from '@/context/auth/auth.context';

const App: FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <Fragment>
            <Head>
                <link rel="shortcut icon" href="/favicon.ico" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <AuthProvider>
                <CartProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </CartProvider>
            </AuthProvider>
        </Fragment>
    );
};

export default App;