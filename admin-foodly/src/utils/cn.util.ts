import type { ClassValue } from 'clsx';
import clsx from 'clsx';

export const cn = (...args: ClassValue[]) => {
    return clsx(...args);
};