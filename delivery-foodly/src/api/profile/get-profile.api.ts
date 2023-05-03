import { useQuery } from '@tanstack/react-query';
import type { User } from '../../types/user.types';
import { fetchHandler } from '../../utils/fetch-handler.util';

export const getProfile = async () => {
    const response = await fetchHandler<User>(
        '/account',
        {
            method: 'GET',
        },
        {
            isAuth: true,
        }
    );

    return response;
};

export const useGetProfile = () => {
    return useQuery({
        queryKey: ['get-profile'],
        queryFn: getProfile,
    });
};