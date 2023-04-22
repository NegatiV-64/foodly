import { useRouter } from 'next/router';
import type { FC } from 'react';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';

export const ServerErrorBoundary: FC<ServerErrorBoundaryProps> = ({ code, message }) => {
    const { back, reload } = useRouter();

    return (
        <Container className='mt-12 flex flex-col items-center justify-center space-y-4'>
            <Heading
                as='h1'
                size='5xl'
            >
                {code}
            </Heading>
            <Text
                size='xl'
                className='text-center'
            >
                {message}
            </Text>
            <Text
                size='lg'
                className='text-center text-gray-500'
            >
                But don{'\''}t worry, you can try to reload the page or go back to the previous page.
            </Text>
            <div
                className='flex items-center justify-center gap-4'
            >
                <Button
                    type='button'
                    onClick={back}
                >
                    Go Back
                </Button>
                <Button
                    type='button'
                    onClick={reload}
                >
                    Try again
                </Button>
            </div>
        </Container>
    );
};

interface ServerErrorBoundaryProps {
    code: number;
    message: string;
}