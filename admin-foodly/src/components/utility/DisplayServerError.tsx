import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import type { FC } from 'react';

export const DisplayServerError: FC<DisplayServerErrorProps> = ({ code, message }) => {
    const { back } = useRouter();

    return (
        <div>
            <Typography variant='h2' component={'h2'}>
                {code}
            </Typography>
            <Typography variant='h1' component={'h1'}>
                Error happened!
            </Typography>
            <Typography variant='body1' component={'p'}>
                {message}
            </Typography>
            <Button onClick={back} type='button'>
                Go back
            </Button>
        </div>
    );
};

interface DisplayServerErrorProps {
    code: number;
    message: string;
}