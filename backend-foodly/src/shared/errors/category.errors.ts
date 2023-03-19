export const CATEGORY_ERRORS = {
    NOT_FOUND(context?: string) {
        let errorMessage = 'Given category was not found';

        if (context) {
            errorMessage = `${errorMessage}. Reason: Category with matching ${context} was not found`;
        }

        return errorMessage;
    },
    ALREADY_EXISTS: 'Category with given name already exists',
} as const;