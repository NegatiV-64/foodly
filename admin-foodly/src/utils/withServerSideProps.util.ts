import { ServerError } from '@/config/exceptions.config';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';

export type WithServerSideProps<Props extends GetServerSidePropsGeneric> = ReturnType<typeof withServerSideProps<Props>>;

export const withServerSideProps = <Props extends GetServerSidePropsGeneric>(
    getServerSideProps: GetServerSideProps<Props>
) => {
    return async (context: GetServerSidePropsContext) => {
        try {
            return await getServerSideProps(context);
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            const errorCode = getErrorCode(error);
            const errorReason = getErrorReason(error);

            return {
                props: {
                    error: {
                        code: errorCode,
                        message: errorMessage,
                        reason: errorReason,
                    },
                },
            };
        }
    };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GetServerSidePropsGeneric = { [key: string]: any };

function getErrorMessage(error: unknown) {
    let errorMessage = 'An unknown error occurred!';

    if (error instanceof Error) {
        errorMessage = error.message;
    }

    return errorMessage;
}

function getErrorCode(error: unknown) {
    let errorCode = 500;

    if (error instanceof ServerError) {
        errorCode = 500;
    }

    return errorCode;
}

function getErrorReason(error: unknown) {
    let errorReason: null | string = null;

    if (error instanceof ServerError) {
        errorReason = error.reason ?? null;
    }

    return errorReason;
}