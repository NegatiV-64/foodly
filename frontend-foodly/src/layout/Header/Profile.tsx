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
                            <span>
                                Sign In
                            </span>
                            <span>
                                Sign Up
                            </span>
                        </div>
                    )
            }
        </Fragment>
    );
};