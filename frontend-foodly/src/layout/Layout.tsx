import type { FC, ReactNode } from 'react';
import { Fragment } from 'react';
import { Header } from '@/layout/Header';
import { Footer } from './Footer';

export const Layout: FC<LayoutProps> = ({ children }) => {
    return (
        <Fragment>
            <Header />
            <main className='bg-gray-50'>
                {children}
            </main>
            <Footer />
        </Fragment>
    );
};

interface LayoutProps {
    children: ReactNode;
}