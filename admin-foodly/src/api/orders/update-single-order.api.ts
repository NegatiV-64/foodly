import type { GetServerSidePropsContext } from 'next';

// TODO - implement this on the backend first
export const updateSingleOrder = async (_orderId: string, _context: GetServerSidePropsContext) =>({
    ok: true,
    code: 200,
    data: true,
    error: null,
});