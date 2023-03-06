import type { FC } from 'react';
import type { AppProps } from 'next/app';
import '@/styles/global.css';
import '@/styles/tailwind.css';
import { Layout } from '@/layout';

const App: FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
};

export default App;