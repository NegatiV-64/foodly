import { Fragment } from 'react';
import type { FC, ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const Layout: FC<LayoutProps> = ({ children }) => {
    return (
        <Fragment>
            <Header />
            <main className='main'>
                <Sidebar />
                <div>
                    {children}
                </div>
            </main>
        </Fragment>
    );
};

interface LayoutProps {
    children: ReactNode;
}