import { BACKEND_URL } from '@/config/env.config';

export const getBackendFileUrl = (url: string) => {
    return `${BACKEND_URL}/${url}`;
};