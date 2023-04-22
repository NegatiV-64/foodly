import { cn } from '@/utils/cn.util';
import type { ComponentPropsWithoutRef, FC } from 'react';
import { HiX } from 'react-icons/hi';
import { useDialogComponentContext } from './Dialog';

export const DialogHeader: FC<DialogHeaderProps> = ({ children, className, iconProps, hasCloseButton = false, ...props }) => {
    const { onClose } = useDialogComponentContext();
    const { className: iconClassName, ...restIconProps } = iconProps || {};

    const onCrossClickHandler = () => {
        if (hasCloseButton === true && onClose) {
            onClose();
        }
    };

    return (
        <header
            className={cn({
                'flex justify-between items-start w-full': hasCloseButton === true,
                className
            })}
            {...props}
        >
            {children}
            {
                hasCloseButton === true &&
                <button
                    className={'flex border-none bg-transparent text-2xl outline-none'}
                    onClick={onCrossClickHandler}
                    type='button'
                >
                    <HiX
                        className={cn(iconClassName)}
                        {...restIconProps}
                    />
                </button>
            }
        </header>
    );
};

type DialogHeaderProps = ComponentPropsWithoutRef<'header'> & {
    iconProps?: ComponentPropsWithoutRef<'svg'>;
    hasCloseButton?: boolean;
};