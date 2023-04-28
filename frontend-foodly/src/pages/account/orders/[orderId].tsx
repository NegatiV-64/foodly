import { getSingleUserOrder } from '@/api/orders/getSingleUserOrder.api';
import { Container } from '@/components/ui/Container';
import { ContentBlock } from '@/components/ui/ContentBlock';
import { ContentColumn } from '@/components/ui/ContentColumn';
import { ContentRow } from '@/components/ui/ContentRow';
import { ContentText } from '@/components/ui/ContentText';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { Table } from '@/components/ui/Table';
import { TableBody } from '@/components/ui/TableBody';
import { TableCell } from '@/components/ui/TableCell';
import { TableHead } from '@/components/ui/TableHead';
import { TableHeadCell } from '@/components/ui/TableHeadCell';
import { TableRow } from '@/components/ui/TableRow';
import { Page } from '@/components/utility/Page';
import { ServerError } from '@/exceptions/server-error.exception';
import type { FullOrder } from '@/types/order.types';
import { capitalize } from '@/utils/capitalize.util';
import { getBackendFileUrl } from '@/utils/get-backend-file-url.util';
import { moneyFormat } from '@/utils/money-format.util';
import { Time } from '@/utils/time.util';
import { validateQueryParam } from '@/utils/validate-query-param.util';
import { withServerSideProps } from '@/utils/with-server-side-props.util';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';

const AccountOrderPage: NextPage<AccountOrderPageProps> = ({ order }) => {
    const { query } = useRouter();
    const orderId = validateQueryParam(query.orderId, 'string');

    return (
        <Page title={`Viewing order #${orderId}`}>
            <Section>
                <Container>
                    <Heading size='3xl' className='text-center'>
                        Viewing order #{orderId}
                    </Heading>
                    <ContentRow className='mt-7 grid grid-cols-4'>
                        <ContentColumn>
                            <ContentBlock title={'Created at'}>
                                <ContentText>
                                    {Time(order.order_created_at).format('DD/MM/YYYY HH:mm')}
                                </ContentText>
                            </ContentBlock>
                            <ContentBlock title={'Order price'}>
                                <ContentText>
                                    {moneyFormat(order.order_price)} soms
                                </ContentText>
                            </ContentBlock>
                        </ContentColumn>
                        <ContentColumn>
                            <ContentBlock title={'Payment method'}>
                                <ContentText>
                                    {order.payment ? capitalize(order.payment.payment_type) : 'No payment'}
                                </ContentText>
                            </ContentBlock>
                            <ContentBlock title={'Order Status'}>
                                <ContentText>
                                    {capitalize(order.order_status)}
                                </ContentText>
                            </ContentBlock>
                        </ContentColumn>
                        <ContentColumn>
                            <ContentBlock title={'Delivery address'}>
                                <ContentText>
                                    {order.delivery?.delivery_address || 'Not specified'}
                                </ContentText>
                            </ContentBlock>
                            <ContentBlock title={'Delivery price'}>
                                <ContentText>
                                    {order.delivery?.delivery_price ? `${moneyFormat(order.delivery.delivery_price - order.order_price)} soms` : 'Not specified'}
                                </ContentText>
                            </ContentBlock>
                        </ContentColumn>
                        <ContentColumn>
                            <ContentBlock title={'Delivery courier'}>
                                <ContentText>
                                    {order.delivery?.delivery_boy ? `${order.delivery.delivery_boy.user_firstname} ${order.delivery.delivery_boy.user_lastname}` : 'Not assigned'}
                                </ContentText>
                            </ContentBlock>
                            <ContentBlock title={'Delivery phone'}>
                                <ContentText>
                                    {order.delivery?.delivery_boy ? `${order.delivery.delivery_boy.user_phone}` : 'Not specified'}
                                </ContentText>
                            </ContentBlock>
                        </ContentColumn>
                    </ContentRow>
                    <Heading className='mt-7 text-center'>
                        Ordered products
                    </Heading>
                    <ContentRow className='mt-5'>
                        <Table>
                            <TableHead>
                                <TableHeadCell>
                                    #
                                </TableHeadCell>
                                <TableHeadCell>
                                    Image
                                </TableHeadCell>
                                <TableHeadCell>
                                    Name
                                </TableHeadCell>
                                <TableHeadCell>
                                    Price
                                </TableHeadCell>
                                <TableHeadCell>
                                    Quantity
                                </TableHeadCell>
                                <TableHeadCell>
                                    Total
                                </TableHeadCell>
                            </TableHead>
                            <TableBody>
                                {order.products.map((product) => (
                                    <TableRow key={product.product_id}>
                                        <TableCell>
                                            {product.product_id}
                                        </TableCell>
                                        <TableCell>
                                            <Image
                                                src={getBackendFileUrl(product.product_image)}
                                                alt={product.product_name}
                                                width={50}
                                                height={50}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {product.product_name}
                                        </TableCell>
                                        <TableCell>
                                            {product.product_price} soms
                                        </TableCell>
                                        <TableCell>
                                            {product.amount}
                                        </TableCell>
                                        <TableCell>
                                            {product.product_price * product.amount} soms
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ContentRow>
                </Container>
            </Section>
        </Page>
    );
};

export const getServerSideProps = withServerSideProps<AccountOrderPageProps>(async (context) => {
    const orderId = validateQueryParam(context.query.orderId, 'string');
    if (!orderId) {
        throw new ServerError(404, 'Order ID not found');
    }

    const { code, data, error, ok } = await getSingleUserOrder(orderId, context);

    if (ok === false || data === null) {
        throw new ServerError(code, `Error happened while retrieving order. Information: ${error}`);
    }

    return {
        props: {
            order: data
        }
    };
});

interface AccountOrderPageProps {
    order: FullOrder;
}

export default AccountOrderPage;