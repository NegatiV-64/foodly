import Head from 'next/head';
import type { FC, ReactNode } from 'react';
import { Fragment } from 'react';

export const Page: FC<PageProps> = ({ children, title }) => {
    const pageTitle = `${title} - Foodly Admin`;

    return (
        <Fragment>
            <Head>
                <title>{pageTitle}</title>
            </Head>
            {children}
        </Fragment>
    );
};

interface PageProps {
    children: ReactNode;
    title: string;
}