import { Container } from '@/components/ui/Container';
import { cn } from '@/utils/cn.util';
import Link from 'next/link';
import type { FC } from 'react';
import { Navigation } from './Navigation';
import { Profile } from './Profile';
import { MdFastfood } from 'react-icons/md';

export const Header: FC = () => {
    return (
        <header className='py-4'>
            <Container className={cn('grid grid-cols-3')}>
                <Link className='flex items-center gap-2 text-3xl' href={'/'}>
                    <MdFastfood className='text-orange-500' />
                    Foodly
                </Link>
                <Navigation />
                <Profile />
            </Container>
        </header>
    );
};
