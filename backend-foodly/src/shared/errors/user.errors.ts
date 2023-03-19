export const USER_ERRORS = {
    NOT_FOUND(context?: string) {
        let errorMessage = 'Given user was not found';

        if (context) {
            errorMessage = `${errorMessage}. Reason: User with matching ${context} was not found`;
        }

        return errorMessage;
    },
    WRONG_PASSWORD: 'Given password is incorrect',
    NOT_VERIFIED: 'User is not verified',
    FORBIDDEN: 'User is not allowed to perform this action',
} as const;