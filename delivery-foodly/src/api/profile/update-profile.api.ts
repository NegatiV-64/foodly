import { fetchHandler } from '../../utils/fetch-handler.util';

export const updateProfile = async (body: UpdateProfileBody) => {
    const requestBody: UpdateProfileBody = {};

    if (body.user_email && body.user_email.length > 0) {
        requestBody.user_email = body.user_email;
    }

    if (body.user_phone && body.user_phone.length > 0) {
        requestBody.user_phone = body.user_phone;
    }

    if (body.user_firstname && body.user_firstname.length > 0) {
        requestBody.user_firstname = body.user_firstname;
    }

    if (body.user_lastname && body.user_lastname.length > 0) {
        requestBody.user_lastname = body.user_lastname;
    }

    if (body.user_old_password && body.user_old_password.length > 0) {
        // Check if the new password is provided
        if (body.user_new_password && body.user_new_password.length > 0) {
            requestBody.user_old_password = body.user_old_password;
            requestBody.user_new_password = body.user_new_password;
        }
    }

    const response = await fetchHandler(
        '/account',
        {
            method: 'PATCH',
            body: JSON.stringify(requestBody),
        },
        {
            isAuth: true,
        }
    );

    return response;
};

export type UpdateProfileBody = Partial<{
    user_email: string;
    user_phone: string;
    user_old_password: string;
    user_new_password: string;
    user_firstname: string;
    user_lastname: string;
}>;