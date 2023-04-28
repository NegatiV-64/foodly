import { getUserOrders } from '@/api/orders/getUserOrders.api';
import { Link } from '@/components/navigation/Link';
import { Pagination } from '@/components/navigation/Pagination';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { Table } from '@/components/ui/Table';
import { TableBody } from '@/components/ui/TableBody';
import { TableCell } from '@/components/ui/TableCell';
import { TableHead } from '@/components/ui/TableHead';
import { TableHeadCell } from '@/components/ui/TableHeadCell';
import { TableRow } from '@/components/ui/TableRow';
import { Page } from '@/components/utility/Page';
import { RoutesConfig } from '@/config/routes.config';
import { ServerError } from '@/exceptions/server-error.exception';
import type { Order } from '@/types/order.types';
import { countTotalPages } from '@/utils/count-total-pages.util';
import { moneyFormat } from '@/utils/money-format.util';
import { Time } from '@/utils/time.util';
import { validateQueryParam } from '@/utils/validate-query-param.util';
import { withServerSideProps } from '@/utils/with-server-side-props.util';
import type { NextPage } from 'next';

export const AccountOrdersPage: NextPage<AccountOrdersPageProps> = ({ orders, pagination }) => {
    return (
        <Page title='My orders'>
            <Section>
                <Container>
                    <Heading>
                        My orders
                    </Heading>
                    <Table className='mt-5 table-fixed'>
                        <TableHead>
                            <TableHeadCell>
                                #
                            </TableHeadCell>
                            <TableHeadCell>
                                Date
                            </TableHeadCell>
                            <TableHeadCell>
                                Status
                            </TableHeadCell>
                            <TableHeadCell>
                                Price
                            </TableHeadCell>
                            <TableHeadCell>
                                Delivery
                            </TableHeadCell>
                            <TableHeadCell>
                                Actions
                            </TableHeadCell>
                        </TableHead>
                        <TableBody>
                            {
                                orders.map((order, index) => (
                                    <TableRow key={order.order_id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{Time(order.order_created_at).format('DD/MM/YYYY HH:mm')}</TableCell>
                                        <TableCell>{order.order_status}</TableCell>
                                        <TableCell>{moneyFormat(order.order_price)} soms</TableCell>
                                        <TableCell>{order.order_delivery_id ? 'Assigned' : 'No assignment'}</TableCell>
                                        <TableCell>
                                            <Link href={RoutesConfig.View_Order(order.order_id)}>
                                                View
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                    <Pagination
                        activePage={pagination.page}
                        pageCount={pagination.total}
                        hrefGenerator={(page) => `/account/orders?page=${page}`}
                    />
                </Container>
            </Section>
        </Page>
    );
};

export const getServerSideProps = withServerSideProps(async (context) => {
    const pageQuery = validateQueryParam(context.query.page, 'number') ?? 1;

    const { code, error, ok, data } = await getUserOrders(pageQuery, context);

    if (ok === false || data === null) {
        throw new ServerError(code, `Error happened while retrieving user orders. Information: ${error}`);
    }

    const pagesCount = countTotalPages(data.total);

    return {
        props: {
            orders: data.orders,
            pagination: {
                total: pagesCount,
                page: pageQuery,
            }
        }
    };
});

interface AccountOrdersPageProps {
    orders: Order[];
    pagination: {
        total: number;
        page: number;
    };
}

export default AccountOrdersPage;