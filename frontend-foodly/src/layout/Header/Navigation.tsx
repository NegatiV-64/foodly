import { cn } from '@/utils/cn.util';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const Navigation = () => {
    const { pathname } = useRouter();

    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <nav className='flex justify-center'>
            <ul className='flex items-center gap-4'>
                {
                    links.map(({ href, label }) => (
                        <li key={href}>
                            <Link className={cn(
                                'text-gray-500 text-xl hover:text-gray-900 focus:outline-none',
                                {
                                    'text-gray-900': isActive(href),
                                }
                            )} href={href}>
                                {label}
                            </Link>
                        </li>
                    ))
                }
            </ul>
        </nav>
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

