import type { FC, ReactNode } from 'react';
import { Header } from '@/layout/Header';
import { Footer } from './Footer';

export const Layout: FC<LayoutProps> = ({ children }) => {
    return (
        <main>
            <Header />
            {children}
            <Footer />
        </main>
    );
};

interface LayoutProps {
    children: ReactNode;
}