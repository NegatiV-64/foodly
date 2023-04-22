import { RoutesConfig } from '@/config/routes.config';
import { FetchError } from '@/exceptions/fetch-error.exception';
import { ServerError } from '@/exceptions/server-error.exception';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';

export const withServerSideProps = <Props extends GetServerSidePropsGeneric = GetServerSidePropsGeneric>(
    getServerSideProps: GetServerSideProps<Props>
) => {
    return async (context: GetServerSidePropsContext) => {
        try {
            return await getServerSideProps(context);
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            const errorCode = getErrorCode(error);

            if (errorCode === 401 || errorCode === 403) {
                return {
                    redirect: {
                        destination: errorCode === 401 ? RoutesConfig.Login : '/403',
                        permanent: false,
                    }
                };
            }

            if (errorCode === 404) {
                return {
                    notFound: true,
                };
            }

            return {
                props: {
                    error: {
                        code: errorCode,
                        message: errorMessage,
                    }
                }
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
        errorCode = error.code;
    }

    if (error instanceof FetchError) {
        errorCode = error.code;
    }

    return errorCode;
}