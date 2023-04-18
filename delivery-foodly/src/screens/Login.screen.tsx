import type { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { HelperText, Text } from 'react-native-paper';
import { Button } from '../components/ui/Button';
import { TextInput } from '../components/form/TextInput';
import type { LoginBody } from '../api/auth/login.api';
import { login } from '../api/auth/login.api';
import { useAuth } from '../contexts/auth';
import { Screen } from '../components/utility/Screen';

export const LoginScreen: FC = () => {
    const { onLogin } = useAuth();
    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormFields>();

    async function onSubmit(formData: LoginFormFields) {
        const requestBody: LoginBody = {
            email: formData.email,
            password: formData.password,
        };

        const { data, error, ok } = await login(requestBody);

        if (ok === false || data === null) {
            console.log('Error', error);
            return null;
        }

        onLogin(data.access_token, data.refresh_token);
    }

    return (
        <Screen style={styles.container}>
            <Text
                style={styles.title}
                variant='headlineLarge'
            >
                Login
            </Text>
            <View style={styles.form}>
                <Controller
                    control={control}
                    rules={{
                        required: true,
                        validate: (value) => value.includes('@'),
                    }}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            autoCapitalize='none'
                            keyboardType='email-address'
                            label="Email"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            error={!!errors.email}
                        />
                    )}
                />
                {
                    errors.email && (
                        <HelperText
                            style={styles.errorText}
                            type='error'
                            visible={!!errors.email}
                        >
                            {errors.email.type === 'required' && 'Email is required'}
                            {errors.email.type === 'validate' && 'Email is invalid'}
                        </HelperText>
                    )
                }
                <Controller
                    control={control}
                    rules={{
                        required: true,
                        minLength: 5,
                    }}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            autoCapitalize='none'
                            keyboardType='visible-password'
                            secureTextEntry={true}
                            label="Password"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            error={!!errors.password}
                        />
                    )}
                />
                {
                    errors.password && (
                        <HelperText
                            style={styles.errorText}
                            type='error'
                            visible={!!errors.password}
                        >
                            {errors.password.type === 'required' && 'Password is required'}
                            {errors.password.type === 'minLength' && 'Password must be at least 5 characters'}
                        </HelperText>
                    )
                }
                <Button
                    style={styles.submitButton}
                    onPress={handleSubmit(onSubmit)}
                    labelStyle={styles.buttonLabel}
                    mode='contained'
                >
                    Login
                </Button>
            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: '15%',
        alignItems: 'center',
        width: '100%'
    },
    title: {
        marginBottom: 20,
    },
    form: {
        width: '90%',
    },
    input: {
        marginBottom: 15,
    },
    errorText: {
        marginBottom: 5,
    },
    submitButton: {
        marginTop: 20,
    },
    buttonLabel: {
        fontSize: 18,
    }
});

interface LoginFormFields {
    email: string;
    password: string;
}