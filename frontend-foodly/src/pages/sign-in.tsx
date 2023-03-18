import { signIn } from '@/api/auth/sign-in.api';
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
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    required={true}
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                                    {...register('email', { required: true })}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required={true}
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                                    {...register('password', { required: true, minLength: 5 })}
                                />
                            </div>
                        </div>
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