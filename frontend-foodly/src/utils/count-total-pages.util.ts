import { TAKE } from '@/config/pagination.config';

export const countTotalPages = (total: number) => {
    return Math.ceil(total / TAKE);
};