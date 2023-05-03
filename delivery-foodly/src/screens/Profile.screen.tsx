import type { FC } from 'react';
import { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/utility/Screen';
import { useGetProfile } from '../api/profile/get-profile.api';
import { Loading } from '../components/utility/Loading';
import { Heading } from '../components/ui/Heading';
import { Container } from '../components/ui/Container';
import { ScrollableView } from '../components/utility/ScrollableView';
import { TextInput } from '../components/form/TextInput';
import { useForm, Controller } from 'react-hook-form';
import { Button, HelperText } from 'react-native-paper';
import { Colors } from '../styles/colors';
import { useAuth } from '../contexts/auth';
import { useQueryClient } from '@tanstack/react-query';
import type { UpdateProfileBody} from '../api/profile/update-profile.api';
import { updateProfile } from '../api/profile/update-profile.api';

export const ProfileScreen: FC = () => {
    // ==== Context ==== //
    const { onLogout: logout } = useAuth();

    // ==== Form ==== //
    const { control, handleSubmit, formState: { errors }, setError } = useForm<ProfileFormFields>();

    // ==== Data ==== //
    const queryClient = useQueryClient();
    const { data, isLoading, isError } = useGetProfile();
    const profile = data?.data;

    if (isLoading) {
        return (
            <Screen>
                <Loading />
            </Screen>
        );
    }
    if (isError || data === undefined || profile === undefined || profile === null || data.ok === false) {
        return (
            <Screen>
                <Heading>
                    Error while loading profile
                </Heading>
                <Text>
                    {typeof data?.error === 'string' ? data.error : `${JSON.stringify(data?.error)}`}
                </Text>
            </Screen>
        );
    }

    async function onUpdateProfile(formData: ProfileFormFields) {
        const { email, firstname, lastname, phone, oldPassword, password, passwordConfirmation } = formData;

        const requestBody: UpdateProfileBody = {};

        // Check if email valid and is changed
        if (email.length > 0 && email.includes('@') === false) {
            setError('email', {
                message: 'Email is not valid',
                type: 'validate'
            });
            return null;
        }

        if (email.length > 0 && email !== profile?.user_email) {
            requestBody.user_email = email;
        }

        // Check if firstname valid and is changed
        if (firstname.length > 0 && firstname !== profile?.user_firstname) {
            requestBody.user_firstname = firstname;
        }

        // Check if lastname valid and is changed
        if (lastname.length > 0 && lastname !== profile?.user_lastname) {
            requestBody.user_lastname = lastname;
        }

        // Check if phone valid and is changed
        if (phone.length > 0 && phone !== profile?.user_phone) {
            requestBody.user_phone = phone;
        }

        // Check if old password is valid
        if (oldPassword && oldPassword.length > 0) {
            requestBody.user_old_password = oldPassword;

            // Check if new password is valid
            if (password && password.length > 0) {
                if (password !== passwordConfirmation) {
                    setError('passwordConfirmation', {
                        message: 'Password confirmation does not match',
                        type: 'validate'
                    });
                    return null;
                }

                requestBody.user_new_password = password;
            }
        }

        const { ok, data } = await updateProfile(requestBody);

        if (ok === false || data === null) {
            return null;
        }

        // Invalidate profile query
        queryClient.invalidateQueries({
            queryKey: ['get-profile']
        });
    }

    async function onLogout() {
        logout();
    }

    return (
        <Screen>
            <ScrollableView>
                <Container style={styles.container}>
                    <Heading style={styles.title}>
                        Your profile
                    </Heading>
                    <View style={styles.form}>
                        <Fragment>
                            <Controller
                                control={control}
                                name='firstname'
                                defaultValue={profile.user_firstname ?? ''}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        label="First name"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        error={errors.firstname !== undefined}
                                    />
                                )}
                            />
                            {
                                errors.firstname !== undefined && (
                                    <HelperText type='error'>
                                        {errors.firstname.message}
                                    </HelperText>
                                )
                            }
                        </Fragment>
                        <Fragment>
                            <Controller
                                control={control}
                                name='lastname'
                                defaultValue={profile.user_lastname ?? ''}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        label="Last name"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        error={errors.lastname !== undefined}
                                    />
                                )}
                            />
                            {
                                errors.lastname !== undefined && (
                                    <HelperText type='error'>
                                        {errors.lastname.message}
                                    </HelperText>
                                )
                            }
                        </Fragment>
                        <Fragment>
                            <Controller
                                control={control}
                                name='email'
                                rules={{
                                    validate: (value) => value.includes('@'),
                                }}
                                defaultValue={profile.user_email ?? ''}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        label="Email"
                                        autoCapitalize='none'
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        keyboardType='email-address'
                                        error={errors.email !== undefined}
                                    />
                                )}
                            />
                            {
                                errors.email !== undefined && (
                                    <HelperText type='error'>
                                        {errors.email.message}
                                    </HelperText>
                                )
                            }
                        </Fragment>
                        <Fragment>
                            <Controller
                                control={control}
                                name='phone'
                                defaultValue={profile.user_phone ?? ''}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        autoCapitalize='none'
                                        label="Phone"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        keyboardType='phone-pad'
                                        error={errors.phone !== undefined}
                                    />
                                )}
                            />
                            {
                                errors.phone !== undefined && (
                                    <HelperText type='error'>
                                        {errors.phone.message}
                                    </HelperText>
                                )
                            }
                        </Fragment>
                        <Fragment>
                            <Controller
                                control={control}
                                name='oldPassword'
                                defaultValue=''
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        autoCapitalize='none'
                                        label="Old password"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        secureTextEntry={true}
                                        error={errors.oldPassword !== undefined}
                                    />
                                )}
                            />
                            {
                                errors.oldPassword !== undefined && (
                                    <HelperText type='error'>
                                        {errors.oldPassword.message}
                                    </HelperText>
                                )
                            }
                        </Fragment>
                        <Fragment>
                            <Controller
                                control={control}
                                name='password'
                                defaultValue=''
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        autoCapitalize='none'
                                        label="Password"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        secureTextEntry={true}
                                        error={errors.password !== undefined}
                                    />
                                )}
                            />
                            {
                                errors.password !== undefined && (
                                    <HelperText type='error'>
                                        {errors.password.message}
                                    </HelperText>
                                )
                            }
                        </Fragment>
                        <Fragment>
                            <Controller
                                control={control}
                                name='passwordConfirmation'
                                defaultValue=''
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        autoCapitalize='none'
                                        label="Password confirmation"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        secureTextEntry={true}
                                        error={errors.passwordConfirmation !== undefined}
                                    />
                                )}
                            />
                            {
                                errors.passwordConfirmation !== undefined && (
                                    <HelperText type='error'>
                                        {errors.passwordConfirmation.message}
                                    </HelperText>
                                )
                            }
                        </Fragment>
                        <Button
                            onPress={handleSubmit(onUpdateProfile)}
                            style={styles.submitButton}
                            mode='contained'
                            labelStyle={styles.submitButtonLabel}
                        >
                            Update profile
                        </Button>
                    </View>
                    <View style={styles.logout}>
                        <Button
                            onPress={onLogout}
                            style={styles.logoutButton}
                            mode='contained'
                            labelStyle={styles.logoutButtonLabel}
                        >
                            Logout
                        </Button>
                    </View>
                </Container>
            </ScrollableView>
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 20,
    },
    title: {
        textAlign: 'center',
        marginBottom: 15,
    },
    form: {
        flexDirection: 'column',
        rowGap: 15,
    },
    submitButton: {
        marginTop: 10,
        backgroundColor: Colors.blue[500]
    },
    submitButtonLabel: {
        fontSize: 18,
    },
    logout: {
        marginTop: 20,
    },
    logoutButton: {
        backgroundColor: Colors.red[500],
    },
    logoutButtonLabel: {
        fontSize: 18,
    }
});

interface ProfileFormFields {
    firstname: string;
    lastname: string;
    email: string;
    oldPassword?: string;
    password?: string;
    passwordConfirmation?: string;
    phone: string;
}