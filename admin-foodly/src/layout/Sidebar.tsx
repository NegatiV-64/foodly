import Box from '@mui/material/Box';
import type { FC } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CategoryIcon from '@mui/icons-material/Category';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import BadgeIcon from '@mui/icons-material/Badge';
import { colors } from '@/styles/theme';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const Sidebar: FC = () => {
    const { pathname } = useRouter();

    const isActiveLink = (link: string) => {
        if (link === '/') {
            return pathname === link;
        }

        return pathname.includes(link);
    };

    return (
        <Box component={'aside'} bgcolor={colors.slate[900]} minHeight={'100%'} py={2} px={2}>
            <Box
                component={'ul'}
                display={'flex'}
                flexDirection={'column'}
                rowGap={3}
            >
                {menuItems.map((item) => (
                    <Box
                        sx={{
                            listStyle: 'none',
                        }}
                        component={'li'}
                        key={item.label}
                    >
                        <Link href={item.link}>
                            <Box
                                display={'flex'}
                                alignItems={'center'}
                                columnGap={1}
                                fontSize={17}
                                sx={{
                                    transition: 'color 0.2s ease-in-out',
                                    color: isActiveLink(item.link) ? colors.white : colors.gray[400],
                                    '&:hover': {
                                        color: colors.white,
                                    }
                                }}
                            >
                                <Box
                                    display={'flex'}
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                    component={'span'}
                                >
                                    {item.icon}
                                </Box>
                                {item.label}
                            </Box>
                        </Link>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};


const menuItems = [
    {
        label: 'Dashboard',
        icon: <DashboardIcon />,
        link: '/',
    },
    {
        label: 'Products',
        icon: <FastfoodIcon />,
        link: '/products',
    },
    {
        label: 'Categories',
        icon: <CategoryIcon />,
        link: '/categories',
    },
    {
        label: 'Orders',
        icon: <RestaurantIcon />,
        link: '/orders',
    },
    {
        label: 'Customers',
        icon: <PeopleIcon />,
        link: '/customers',
    },
    {
        label: 'Employees',
        icon: <BadgeIcon />,
        link: '/employees',
    },
    {
        label: 'Deliveries',
        icon: <DeliveryDiningIcon />,
        link: '/deliveries',
    },
    {
        label: 'Payments',
        icon: <ReceiptIcon />,
        link: '/payments',
    },
];