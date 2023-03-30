// Write a React hook that returns a stateful value, a callback to close the dialog, and a callback to open the dialog.

import { useState } from 'react';

export const useDialog: UseDialog = (intialValue = false) => {
    const [isOpen, setIsOpen] = useState(intialValue);

    const openDialog = () => setIsOpen(true);
    const closeDialog = () => setIsOpen(false);

    return [isOpen, openDialog, closeDialog];
};

export type UseDialog = (intialValue?: boolean) => [boolean, () => void, () => void];