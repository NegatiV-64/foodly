import { useCallback, useState } from 'react';

export const useDialog: UseDialog = (intialValue = false) => {
    const [isOpen, setIsOpen] = useState(intialValue);

    const openDialog = useCallback(() => setIsOpen(true), []);
    const closeDialog = useCallback(() => setIsOpen(false), []);

    return [isOpen, openDialog, closeDialog];
};

export type UseDialog = (intialValue?: boolean) => [IsOpen, OpenDialogCallback, CloseDialogCallback];
type IsOpen = boolean;
type OpenDialogCallback = () => void;
type CloseDialogCallback = () => void;