import { Layout } from '@/layout/Layout';
import type { NextPage } from 'next';

export const withLayout = <P extends object>(Component: NextPage<P>) => {
    return function WithLayoutComponent(props: P) {
        return (
            <Layout>
                <Component {...props} />
            </Layout>
        );
    };
};