import { singUp } from '@/api/auth/sign-up.api';
import { verify } from '@/api/auth/verify.api';
import { Dialog } from '@/components/feedback/Dialog';
import { DialogBody } from '@/components/feedback/DialogBody';
import { DialogFooter } from '@/components/feedback/DialogFooter';
import { DialogHeader } from '@/components/feedback/DialogHeader';
import { DialogTitle } from '@/components/feedback/DialogTitle';
import { InputField } from '@/components/form/InputField';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { Text } from '@/components/ui/Text';
import { Page } from '@/components/utility/Page';
import { RoutesConfig } from '@/config/routes.config';
import { useDialog } from '@/hooks/useDialog.hook';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const SignUpPage: NextPage = () => {
    const { replace } = useRouter();

    // ==== Dialogs ==== //
    const [isSuccessDialogOpen, openSuccessDialog, closeSuccessDialog] = useDialog();
    const [isErrorDialogOpen, openErrorDialog, closeErrorDialog] = useDialog();
    const [errorMessage, setErrorMessage] = useState<string>('');

    // ==== Forms ==== //
    const { register: registerCreation, handleSubmit: handleSubmitCreation } = useForm<SignUpFormValues>();
    const { register: registerConfirmation, handleSubmit: handleSubmitConfirmation } = useForm<ConfirmationFormValues>();
    const [accountEmail, setAccountEmail] = useState<string | null>(null);
    const [showVerificationCodeForm, setShowVerificationCodeForm] = useState(false);

    async function onCreationSubmit(values: SignUpFormValues) {
        const { confirm_password, email, password, phone } = values;

        if (confirm_password !== password) {
            setErrorMessage('Passwords do not match');
            openErrorDialog();
            return null;
        }

        const { code, ok, error } = await singUp({
            email: email,
            password: password,
            phone: phone,
        });

        if (ok === false) {
            setErrorMessage(`Error happened!. Code ${code}. Error: ${error}`);
            openErrorDialog();
            return null;
        }

        setAccountEmail(email);
        setShowVerificationCodeForm(true);
    }

    async function onConfirmationSubmit(values: ConfirmationFormValues) {
        if (accountEmail === null) {
            setErrorMessage('Something went wrong. Email is not set');
            openErrorDialog();
            return null;
        }

        const { verification_code } = values;

        const { code, error, ok } = await verify({
            email: accountEmail,
            verification_code: verification_code,
        });

        if (ok === false) {
            setErrorMessage(`Error happened!. Code ${code}. Error: ${error}`);
            openErrorDialog();
            return null;
        }

        openSuccessDialog();
    }

    function onLoginClick() {
        closeSuccessDialog();
        replace(RoutesConfig.Login);
    }

    return (
        <Page title='Create an account'>
            <Section>
                <Container className='flex flex-col items-center'>
                    <Heading size='2xl'>
                        Create an account
                    </Heading>
                    <Text className='mt-2 max-w-2xl text-center text-gray-500'>
                        To create an account, please enter your email address, phone number, and password. After this, you will receive a verification code to email address.
                    </Text>
                    {
                        showVerificationCodeForm === false
                            ? (
                                <form
                                    className='mt-4 w-full max-w-md space-y-6'
                                    onSubmit={handleSubmitCreation(onCreationSubmit)}
                                >
                                    <InputField
                                        label='Email address'
                                        required={true}
                                        type='email'
                                        {...registerCreation('email')}
                                        placeholder='Enter your email address'
                                    />
                                    <InputField
                                        label='Phone number'
                                        required={true}
                                        type='tel'
                                        {...registerCreation('phone')}
                                        placeholder='Enter your phone number'
                                    />
                                    <InputField
                                        label='Password'
                                        required={true}
                                        type='password'
                                        {...registerCreation('password')}
                                        placeholder='Enter your password'
                                    />
                                    <InputField
                                        label='Confirm password'
                                        required={true}
                                        type='password'
                                        {...registerCreation('confirm_password')}
                                        placeholder='Confirm your password'
                                    />
                                    <Button type='submit'>
                                        Create an account
                                    </Button>
                                </form>
                            )
                            : (
                                <form
                                    className='mt-4 w-full max-w-md space-y-6'
                                    onSubmit={handleSubmitConfirmation(onConfirmationSubmit)}
                                >
                                    <InputField
                                        label='Verification code'
                                        required={true}
                                        type='text'
                                        {...registerConfirmation('verification_code')}
                                        placeholder='Enter your verification code'
                                    />
                                    <Button type='submit'>
                                        Verify
                                    </Button>
                                </form>
                            )
                    }

                </Container>
            </Section>
            <Dialog
                open={isSuccessDialogOpen}
                onClose={onLoginClick}
            >
                <DialogHeader>
                    <DialogTitle>
                        Регистрация прошла успешно
                    </DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <Text>
                        Вы успешно зарегистрировались. Пожалуйста, войдите в свой аккаунт.
                    </Text>
                </DialogBody>
                <DialogFooter>
                    <Button onClick={onLoginClick}>
                        Войти
                    </Button>
                </DialogFooter>
            </Dialog>
            <Dialog
                open={isErrorDialogOpen}
                onClose={closeErrorDialog}
            >
                <DialogHeader>
                    <DialogTitle>
                        Регистрация не удалась
                    </DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <Text>
                        {errorMessage}
                    </Text>
                </DialogBody>
                <DialogFooter>
                    <Button onClick={closeErrorDialog}>
                        Закрыть
                    </Button>
                </DialogFooter>
            </Dialog>
        </Page>
    );
};

interface SignUpFormValues {
    email: string;
    phone: string;
    password: string;
    confirm_password: string;
}

interface ConfirmationFormValues {
    verification_code: string;
}

export default SignUpPage;