import { useAuth } from '@/context/auth/auth.context';
import { Fragment } from 'react';
import { Root, Trigger, Content, Item } from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import { Link as CustomLink } from '@/components/navigation/Link';
import { RoutesConfig } from '@/config/routes.config';
import { cn } from '@/utils/cn.util';

export const Profile = () => {
    const { user, status } = useAuth();

    const dropdownStyles = {
        content: 'duration-200 flex w-[var(--radix-dropdown-menu-trigger-width)] flex-col bg-red-white shadow-elevation-2 rounded-lg overflow-hidden',
        contentOpen: 'data-[state=open]:animate-in data-[state=open]:slide-in-from-top-2 data-[state=open]:fade-in data-[state=open]:fill-mode-forwards',
        contentClosed: 'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-2 data-[state=closed]:fade-out data-[state=closed]:fill-mode-forwards',
        item: 'bg-white py-2 px-1 text-center outline-none duration-200 hover:outline-none hover:bg-orange-200'
    };

    return (
        <Fragment>
            {
                status === 'logged' && user !== null
                    ? (
                        <Root modal={false}>
                            <Trigger role={'menu'} className='text-lg outline-none'>
                                {user.user_email}
                            </Trigger>
                            <Content
                                align='start'
                                hideWhenDetached={true}
                                sideOffset={10}
                                className={cn(dropdownStyles.content, dropdownStyles.contentOpen, dropdownStyles.contentClosed)}
                            >
                                <Item className={dropdownStyles.item}>
                                    <Link href={RoutesConfig.Account}>
                                        View Account
                                    </Link>
                                </Item>
                                <Item className={dropdownStyles.item}>
                                    <button type='button'>
                                        Logout
                                    </button>
                                </Item>
                            </Content>
                        </Root>
                    )
                    : (
                        <div className='flex items-center justify-end gap-5'>
                            <CustomLink href={RoutesConfig.Login} className='text-stone-900 hover:scale-95 hover:bg-transparent hover:text-stone-900' variant='text'>
                                Sign In
                            </CustomLink>
                            <CustomLink href={RoutesConfig.Register} className='hover:scale-95'>
                                Sign Up
                            </CustomLink>
                        </div>
                    )
            }
        </Fragment>
    );
};