import { Container } from '@/components/ui/Container';
import { Text } from '@/components/ui/Text';
import { cn } from '@/utils/cn.util';
import Link from 'next/link';
import { HiHeart } from 'react-icons/hi';
import { SiReact } from 'react-icons/si';

export const Footer = () => {
    return (
        <footer className='mt-auto pt-5'>
            <Container>
                <nav className='flex flex-wrap justify-center'>
                    <ul className='flex '>
                        {
                            links.map(({ href, label }) => (
                                <li key={href} className={'px-5 py-2'}>
                                    <Link href={href} className={cn('text-base text-gray-500 hover:text-gray-900 duration-200')}>
                                        {label}
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                </nav>
            </Container>
            <div className='mt-4 bg-slate-800 py-5'>
                <Text size='lg' className={cn('flex items-center justify-center gap-1 text-white')}>
                    {new Date().getFullYear()}. Made with <HiHeart className='text-2xl text-red-500' /> and <SiReact className='animate-spin-slow text-[#61DAFB]' /> by <a href='/'>Aziz Bektemirov</a>
                </Text>
            </div>
        </footer>
    );
};

const links = [
    {
        href: '/',
        label: 'Home',
    },
    {
        href: '/about',
        label: 'About Us',
    },
    {
        href: '/menu',
        label: 'Menu',
    },
    {
        href: '/contact',
        label: 'Contact Us',
    },
];