import { Fragment } from 'react';
import type { FC } from 'react';
import type { AppProps } from 'next/app';
import '@/styles/root.css';
import '@/styles/tailwind.css';
import { Layout } from '@/layout';
import Head from 'next/head';
import { CartProvider } from '@/context/cart';
import { AuthProvider } from '@/context/auth/auth.context';
import { ServerErrorBoundary } from '@/components/error/ServerErrorBoundary';
import { ClientErrorBoundary } from '@/components/error/ClientErrorBoundary';

const App: FC<AppProps> = ({ Component, pageProps }) => {
    const { error } = pageProps;

    if (error) {
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
                            <ServerErrorBoundary
                                code={error.code ?? 500}
                                message={error.message ?? 'Internal Server Error. Please try again later or contact us.'}
                            />
                        </Layout>
                    </CartProvider>
                </AuthProvider>
            </Fragment>
        );
    }

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
                        <ClientErrorBoundary>
                            <Component {...pageProps} />
                        </ClientErrorBoundary>
                    </Layout>
                </CartProvider>
            </AuthProvider>
        </Fragment>
    );
};

export default App;