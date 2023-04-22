import { TAKE } from '@/config/pagination.config';

export const countSkip = (page: number) => {
    return (page - 1) * TAKE;
};