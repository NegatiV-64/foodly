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
} as const;

export const AUTH_ERRORS = {
    VERIFICATION_ERROR_NO_TOKEN: 'User is already validated!',
    VERIFICATION_ERROR_WRONG_TOKEN: 'Given verification code is wrong',
    VERIFICATION_ERROR_EXPIRED_TOKEN: 'Verification code is expired',
    REFRESH_ERROR_EXPIRED_TOKEN: 'Refresh token is expired',
    REFRESH_ERROR_NO_TOKEN: 'No refresh token is found in the database',
    REFRESH_ERROR_WRONG_TOKEN: 'Refresh token is wrong',
} as const;

export const ACCOUNT_ERRORS = {
    ACCOUNT_ERROR_NO_OLD_PASSWORD: 'Old password should be provided',
    ACCOUNT_ERROR_NO_NEW_PASSWORD: 'New password should be provided',
    ACCOUNT_ERROR_WRONG_PASSWORD: 'Given password is incorrect',
    ACCOUNT_ERROR_SAME_PASSWORDS: 'New and old passwords are the same'
} as const;