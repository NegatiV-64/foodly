import { login } from '@/api/auth/login.api';
import { Page } from '@/components/utility/Page';
import { useAuth } from '@/contexts/auth/auth.context';
import { colors } from '@/styles/theme';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';

const LoginPage: NextPage = () => {
    const { onLogin } = useAuth();
    const { register, handleSubmit } = useForm<LoginFormFields>();

    async function onSubmit(data: LoginFormFields) {
        console.log(data);
        const { data: responseData, ok } = await login({
            email: data.email,
            password: data.password,
        });

        if (ok === false || responseData === null) {
            alert('Login failed. Please try again.');
            return null;
        }

        onLogin(responseData.access_token, responseData.refresh_token);
    }

    return (
        <Page title='Login'>
            <Box
                component={'section'}
                height={'100%'}
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'center'}
            >
                <Box
                    component={'div'}
                    bgcolor={colors.slate[900]}
                    borderRadius={4}
                    py={6}
                    px={10}
                >
                    <Typography variant='h2' mb={2} textAlign={'center'} component={'h2'}>
                        Login
                    </Typography>
                    <Box onSubmit={handleSubmit(onSubmit)} component={'form'}>
                        <TextField
                            label='Email'
                            variant='outlined'
                            fullWidth={true}
                            margin='dense'
                            type='email'
                            {...register('email')}
                        />
                        <TextField
                            size='medium'
                            label='Password'
                            variant='outlined'
                            fullWidth={true}
                            margin='dense'
                            type='password'
                            {...register('password')}
                        />
                        <Button
                            variant='contained'
                            color='primary'
                            fullWidth={true}
                            type='submit'
                            sx={{
                                mt: 2,
                            }}
                        >
                            Login
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Page>
    );
};

interface LoginFormFields {
    email: string;
    password: string;
}

export default LoginPage;