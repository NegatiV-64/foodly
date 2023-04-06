import { getDeliveries } from '@/api/deliveries/get-deliveries.api';
import { getOrders } from '@/api/orders/get-orders.api';
import { getPayments } from '@/api/payments/get-payments.api';
import { Page } from '@/components/utility/Page';
import { ServerError } from '@/config/exceptions.config';
import type { Order } from '@/interfaces/order.interface';
import { Time } from '@/utils/dayjs.util';
import { withLayout } from '@/utils/withLayout.util';
import type { WithServerSideProps } from '@/utils/withServerSideProps.util';
import { withServerSideProps } from '@/utils/withServerSideProps.util';
import type { NextPage } from 'next';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { colors } from '@/styles/theme';
import type { Payment } from '@/interfaces/payment.interface';
import type { Delivery } from '@/interfaces/delivery.interface';

const HomePage: NextPage<HomePageProps> = ({ orders, deliveries, payments }) => {
  const overviewCards = [
    {
      icon: '🛒',
      title: 'Orders',
      data: orders.length,
    },
    {
      icon: '🚚',
      title: 'Deliveries',
      data: deliveries.length,
    },
    {
      icon: '💰',
      title: 'Payments',
      data: payments.length,
    }
  ];

  return (
    <Page title='Dashboard'>
      <Box
        component={'section'}
        pt={3}
      >
        <Container>
          <Typography variant='h2' component={'h2'} mb={2} fontWeight={'medium'}>
            Overview for today
          </Typography>
          <Box
            display={'grid'}
            gridTemplateColumns={'repeat(3, 1fr)'}
            gap={4}
          >
            {
              overviewCards.map((item) => (
                <Card
                  key={item.title}
                  sx={{
                    px: 3,
                    py: 4,
                    bgcolor: colors.clay[800],
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box
                  >
                    <Typography
                      variant='h3'
                      fontWeight={'medium'}
                      sx={{
                        mb: 1
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      fontWeight={'bold'}
                      variant='h2'
                    >
                      {item.data}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant='h1'
                    >
                      {item.icon}
                    </Typography>
                  </Box>
                </Card>
              ))
            }
          </Box>
        </Container>
      </Box>
      <Box
        component={'section'}
        pt={7}
      >
        <Container>
          <Typography variant='h2' component={'h2'} mb={2} fontWeight={'medium'}>
            Orders
          </Typography>
          {
            orders.length > 0
              ?
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      Order ID
                    </TableCell>
                    <TableCell>
                      Order Price
                    </TableCell>
                    <TableCell>
                      Order Status
                    </TableCell>
                    <TableCell>
                      Order Created At
                    </TableCell>
                    <TableCell>
                      Order User ID
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    orders.map((order) => (
                      <TableRow key={order.order_id}>
                        <TableCell>
                          {order.order_id}
                        </TableCell>
                        <TableCell>
                          {order.order_price}
                        </TableCell>
                        <TableCell>
                          {order.order_status}
                        </TableCell>
                        <TableCell>
                          {order.order_created_at}
                        </TableCell>
                        <TableCell>
                          {order.order_user_id}
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
              :
              <Typography variant='h3' component={'h3'} mb={2} fontWeight={'medium'}>
                No orders found for today
              </Typography>
          }
        </Container>
      </Box>
      <Box
        component={'section'}
        pt={7}
      >
        <Container>
          <Typography variant='h2' component={'h2'} mb={2} fontWeight={'medium'}>
            Deliveries
          </Typography>
          {
            deliveries.length > 0
              ?
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      Delivery ID
                    </TableCell>
                    <TableCell>
                      Delivery Price
                    </TableCell>
                    <TableCell>
                      Delivery Status
                    </TableCell>
                    <TableCell>
                      Delivery Created At
                    </TableCell>
                    <TableCell>
                      Delivery User ID
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    deliveries.map((delivery) => (
                      <TableRow key={delivery.delivery_id}>
                        <TableCell>
                          {delivery.delivery_id}
                        </TableCell>
                        <TableCell>
                          {delivery.delivery_price}
                        </TableCell>
                        <TableCell>
                          {delivery.delivery_status}
                        </TableCell>
                        <TableCell>
                          {delivery.delivery_created_at}
                        </TableCell>
                        <TableCell>
                          {
                            delivery.delivery_boy ?
                              `${delivery.delivery_boy.user_firstname} ${delivery.delivery_boy.user_lastname}`
                              :
                              'Not assigned'
                          }
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
              :
              <Typography variant='h3' component={'h3'} mb={2} fontWeight={'medium'}>
                No deliveries found for today
              </Typography>
          }
        </Container>
      </Box>
      <Box
        component={'section'}
        pt={7}
        pb={10}
      >
        <Container>
          <Typography variant='h2' component={'h2'} mb={2} fontWeight={'medium'}>
            Payments
          </Typography>
          {
            payments.length > 0
              ?
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      Payment ID
                    </TableCell>
                    <TableCell>
                      Payment Type
                    </TableCell>
                    <TableCell>
                      Payment Date
                    </TableCell>
                    <TableCell>
                      Payment Created At
                    </TableCell>
                    <TableCell>
                      Payment User ID
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    payments.map((payment) => (
                      <TableRow key={payment.payment_id}>
                        <TableCell>
                          {payment.payment_id}
                        </TableCell>
                        <TableCell>
                          {payment.payment_type}
                        </TableCell>
                        <TableCell>
                          {payment.payment_date}
                        </TableCell>
                        <TableCell>
                          {payment.payment_order_id}
                        </TableCell>
                        <TableCell>
                          {payment.payment_user_id}
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
              :
              <Typography variant='h3' component={'h3'} mb={2} fontWeight={'medium'}>
                No payments found for today
              </Typography>
          }
        </Container>
      </Box>
    </Page>
  );
};

export const getServerSideProps: WithServerSideProps<HomePageProps> = withServerSideProps(async (context) => {
  const [ordersResponse, deliveriesResponse, paymentsResponse] = await Promise.all([
    getOrders({
      page: 1,
      sort: 'order_created_at',
      order: 'desc',
      createdAt: Time().format('DD-MM-YYYY')
    }, context),
    getDeliveries({
      page: 1,
      sort: 'delivery_created_at',
      createdAt: Time().format('DD-MM-YYYY'),
      order: 'desc',
    }, context),
    getPayments({
      page: 1,
      createdAt: Time().format('DD-MM-YYYY'),
      order: 'desc',
    }, context),
  ]);

  if (ordersResponse.ok === false || ordersResponse.data === null) {
    throw new ServerError(
      ordersResponse.code,
      'Error while fetching orders',
    );
  }
  if (deliveriesResponse.ok === false || deliveriesResponse.data === null) {
    throw new ServerError(
      deliveriesResponse.code,
      'Error while fetching deliveries',
    );
  }
  if (paymentsResponse.ok === false || paymentsResponse.data === null) {
    throw new ServerError(
      paymentsResponse.code,
      'Error while fetching payments',
    );
  }

  return {
    props: {
      orders: ordersResponse.data.orders,
      deliveries: deliveriesResponse.data.deliveries,
      payments: paymentsResponse.data.payments,
    }
  };
});

interface HomePageProps {
  orders: Pick<Order, 'order_id' | 'order_price' | 'order_status' | 'order_created_at' | 'order_user_id' | 'order_delivery_id'>[];
  payments: Pick<Payment, 'payment_date' | 'payment_id' | 'payment_type' | 'payment_user_id' | 'payment_order_id'>[];
  deliveries: Pick<Delivery, 'delivery_id' | 'delivery_status' | 'delivery_created_at' | 'delivery_finished_at' | 'delivery_price' | 'delivery_boy' | 'delivery_address'>[];
}

export default withLayout(HomePage);