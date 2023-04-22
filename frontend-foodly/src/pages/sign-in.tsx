import { signIn } from '@/api/auth/sign-in.api';
import { InputField } from '@/components/form/InputField';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Page } from '@/components/utility/Page';
import { useAuth } from '@/context/auth/auth.context';
import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';

const SignInPage: NextPage = () => {
    const { register, handleSubmit } = useForm<SignInFormFields>();
    const { onLogin } = useAuth();

    async function onSignInSubmit(data: SignInFormFields) {
        const { data: responseData, error, ok } = await signIn({
            email: data.email,
            password: data.password,
        });

        if (ok === false || responseData === null) {
            alert(error);
            return null;
        }

        onLogin(responseData.access_token, responseData.refresh_token);
    }

    return (
        <Page title='Sign In'>
            <section>
                <Container className='mt-8 flex flex-col items-center'>
                    <Heading size='2xl'>
                        Sign In to your account
                    </Heading>
                    <form
                        onSubmit={handleSubmit(onSignInSubmit)}
                        className='mt-4 w-full max-w-md space-y-6'
                    >
                        <InputField
                            label='Email'
                            type='email'
                            autoComplete='email'
                            required={true}
                            {...register('email', { required: true })}
                        />
                        <InputField
                            label='Password'
                            type='password'
                            autoComplete='current-password'
                            required={true}
                            {...register('password', { required: true, minLength: 5 })}
                        />
                        <Button className='w-full' type='submit'>
                            Submit
                        </Button>
                    </form>
                </Container>
            </section>
        </Page>
    );
};

export default SignInPage;

interface SignInFormFields {
    email: string;
    password: string;
}