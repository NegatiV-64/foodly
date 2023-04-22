import { useRouter } from 'next/router';
import type { FC, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';

export const ClientErrorBoundary: FC<ClientErrorBoundaryProps> = ({ children }) => {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
        >
            {children}
        </ErrorBoundary>
    );
};

const ErrorFallback: FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
    const { back } = useRouter();

    return (
        <Container className='mt-12 flex flex-col items-center justify-center space-y-4'>
            <Heading
                as='h1'
                size='3xl'
            >
                Something went wrong!
            </Heading>
            <Text
                size='xl'
                className='text-center'
            >
                {error.message}
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
                    onClick={resetErrorBoundary}
                >
                    Try again
                </Button>
                <Button
                    variant='outlined'
                    className='border border-solid border-gray-300 text-gray-700 hover:bg-transparent hover:text-gray-900'
                    type='button'
                    onClick={back}
                >
                    Go back
                </Button>
            </div>
        </Container>
    );
};

interface ClientErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}