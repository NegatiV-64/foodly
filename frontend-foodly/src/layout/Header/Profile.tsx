import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/auth/auth.context';
import { Fragment } from 'react';

export const Profile = () => {
    const { user, status } = useAuth();

    return (
        <Fragment>

            {
                status === 'logged' && user !== null
                    ? (
                        <Fragment>
                            <p>{user.user_fullname}</p>
                            <p>{user.user_email}</p>
                        </Fragment>
                    )
                    : (
                        <div className='flex items-center justify-end gap-5'>
                            <Button className='text-stone-900 hover:scale-95' variant='text'>
                                Sign In
                            </Button>
                            <Button className='hover:scale-95'>
                                Sign Up
                            </Button>
                        </div>
                    )
            }
        </Fragment>
    );
};