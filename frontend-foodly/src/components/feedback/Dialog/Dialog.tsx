import { createContext, useContext } from 'react';
import type { FC, ReactNode, ComponentPropsWithoutRef } from 'react';
import { Content, Overlay, Portal, Root } from '@radix-ui/react-dialog';
import { cn } from '@/utils/cn.util';

const dialogContext = createContext<DialogContext>({} as DialogContext);
export const useDialogComponentContext = () => useContext(dialogContext);

export const Dialog: FC<DialogProps> = ({ onClose, open, children, closeOnEscape = true, closeOnOutside = true, dialogContentProps, dialogOverlayProps, onOpen }) => {
    const { className: dialogContentClassname, ...restDialogContentProps } = dialogContentProps || {};
    const { className: dialogOverlayClassname, ...restDialogOverlayProps } = dialogOverlayProps || {};

    const contextValue: DialogContext = {
        open: open,
        onClose: onClose,
        onOpen: onOpen
    };

    function onOpenChangeHandler(open: boolean) {
        if (open === false) {
            onClose();
        }

        if (open === true) {
            if (onOpen) {
                onOpen();
            }
        }
    }

    function onEscapePressHandler(e: KeyboardEvent) {
        if (closeOnEscape === false) {
            e.preventDefault();
        }
    }

    function onClickContentOutside(event: PointerDownOutsideEvent | FocusOutsideEvent) {
        if (closeOnOutside === false) {
            event.preventDefault();
        }
    }


    return (
        <dialogContext.Provider value={contextValue}>
            <Root open={open} modal={true} onOpenChange={onOpenChangeHandler}>
                <Portal>
                    <Overlay
                        className={cn(
                            'z-50 fixed rounded-xl inset-0 bg-black/40 transition-opacity duration-200',
                            'data-[state=open]:animate-in data-[state=open]:fade-in',
                            'data-[state=closed]:animate-out data-[state=closed]:fade-out',
                            dialogOverlayClassname,
                        )}
                        {...restDialogOverlayProps}
                    >
                        <div>
                            <Content
                                className={cn(
                                    'flex flex-col items-center bg-white mx-auto mt-20 p-7 rounded-xl w-[500px] shadow-md gap-y-4',
                                    'data-[state=open]:animate-in data-[state=open]:slide-in-from-top-10 data-[state=open]:fade-in data-[state=open]:zoom-in-[0.8]',
                                    'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-10 data-[state=closed]:fade-out data-[state=closed]:zoom-out-[0.8]',
                                    dialogContentClassname,
                                )}
                                onEscapeKeyDown={onEscapePressHandler}
                                onOpenAutoFocus={(e) => e.preventDefault()}
                                onInteractOutside={onClickContentOutside}
                                {...restDialogContentProps}
                            >
                                {children}
                            </Content>
                        </div>
                    </Overlay>
                </Portal>
            </Root>
        </dialogContext.Provider>
    );
};

interface DialogProps {
    open: boolean;
    onClose: () => void;
    onOpen?: () => void;
    children?: ReactNode;
    closeOnEscape?: boolean;
    closeOnOutside?: boolean;
    dialogOverlayProps?: Omit<ComponentPropsWithoutRef<typeof Overlay>, 'children'>;
    dialogContentProps?: Omit<ComponentPropsWithoutRef<typeof Content>, 'onInteractOutside' | 'onOpenAutoFocus' | 'onEscapeKeyDown'>;
}

interface DialogContext {
    open: boolean;
    onClose: () => void;
    onOpen?: () => void;
}

type PointerDownOutsideEvent = CustomEvent<{
    originalEvent: PointerEvent;
}>;
type FocusOutsideEvent = CustomEvent<{
    originalEvent: FocusEvent;
}>;