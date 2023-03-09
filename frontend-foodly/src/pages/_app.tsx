import { Fragment } from 'react';
import type { FC } from 'react';
import type { AppProps } from 'next/app';
import '@/styles/root.css';
import '@/styles/tailwind.css';
import { Layout } from '@/layout';
import Head from 'next/head';

const App: FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <Fragment>
            <Head>
                <link rel="shortcut icon" href="/favicon.ico" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </Fragment>
    );
};

export default App;