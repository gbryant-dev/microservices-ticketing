import Router from 'next/router';
import { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/useRequest';

const OrderShow = ({ order, currentUser }) => {
  const [expiresIn, setExpiresIn] = useState(0);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: (payment) => Router.push('/orders')
  })

  useEffect(() => {
    const calculateExpiry = () => {
      const remaining = Math.round((new Date(order.expiresAt) - new Date()) / 1000);
      setExpiresIn(remaining);
    }

    calculateExpiry();
    const interval = setInterval(calculateExpiry, 1000);

    return () => {
      clearInterval(interval);
    }
  }, []);

  // if (expiresIn < 0) {
  //   return <div>Order has expired</div>
  // }

  return (
    <div>
      Time left to pay: {expiresIn}
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey={process.env.NEXT_PUBLIC_STRIPE_KEY}
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
}

OrderShow.getInitialProps = async (context, client, currentUser) => {
  const { orderId } = context.query;
  
  const { data } = await client.get(`/api/orders/${orderId}`);
  console.log(data);

  return { order: data }
}

export default OrderShow;