/* eslint-disable react/button-has-type */
import { cn } from '@/utils/cn.util';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { forwardRef } from 'react';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, className, disabled, onClick,
        startIcon, endIcon, loading = false,
        size = 'medium', color = 'default', variant = 'contained',
        type = 'button', ...props
    }, ref) => {
        return (
            <button
                ref={ref}
                onClick={onClick}
                disabled={disabled === true || loading === true}
                className={cn(
                    'rounded-md inline-flex items-center justify-center gap-1 touch-manipulation will-change-[background,_box-shadow] select-none h-min text-center no-underline transform-none border-none outline-none duration-200',
                    'disabled:bg-neutral-400 disabled:hover:cursor-not-allowed',
                    {
                        'px-3 py-2 text-sm': size === 'small',
                        'px-4 py-2 text-base': size === 'medium',
                        'px-5 py-2 text-lg': size === 'large',
                    },
                    {
                        'bg-orange-500 text-white border-orange-500 hover:bg-orange-600': color === 'default',
                        'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600 focus:shadow-emerald-100': color === 'success',
                        'bg-amber-500 text-white border-amber-500 hover:bg-amber-600 focus:shadow-amber-100': color === 'warning',
                        'bg-red-600 text-white border-red-600 hover:bg-red-700 focus:shadow-red-100': color === 'error',
                    },
                    {
                        'border': variant === 'contained',
                        'border bg-transparent': variant === 'outlined',
                        'border border-transparent bg-transparent hover:bg-transparent': variant === 'text',
                    },
                    className
                )}
                type={type ?? 'button'}
                {...props}
            >
                {
                    loading === true &&
                    <svg
                        aria-hidden="true"
                        role="status"
                        className="mr-2 inline h-4 w-4 animate-spin text-gray-200"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#7acbc1" />
                    </svg>
                }
                {
                    startIcon !== undefined && loading === false &&
                    <span className={'flex items-center justify-center'}>
                        {startIcon}
                    </span>
                }
                {children}
                {
                    endIcon !== undefined && loading === false &&
                    <span className={'flex items-center justify-center'}>
                        {endIcon}
                    </span>
                }
            </button>
        );
    }
);

Button.displayName = 'Button';

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
    size?: 'small' | 'medium' | 'large';
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    variant?: 'contained' | 'outlined' | 'text';
    color?: 'default' | 'success' | 'warning' | 'error';
    loading?: boolean;
};
