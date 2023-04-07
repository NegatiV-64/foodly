import { amountToDisplay } from '@/config/pagination.config';

export const countTotalPages = (total: number): number => {
    return Math.ceil(total / amountToDisplay);
};