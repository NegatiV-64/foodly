export const AUTH_ERRORS = {
    VERIFICATION_ERROR_NO_TOKEN: 'User is already validated!',
    VERIFICATION_ERROR_WRONG_TOKEN: 'Given verification code is wrong',
    VERIFICATION_ERROR_EXPIRED_TOKEN: 'Verification code is expired',
    REFRESH_ERROR_EXPIRED_TOKEN: 'Refresh token is expired',
    REFRESH_ERROR_NO_TOKEN: 'No refresh token is found in the database',
    REFRESH_ERROR_WRONG_TOKEN: 'Refresh token is wrong',
} as const;