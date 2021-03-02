import { useState, useEffect } from 'react';

const OrderShow = ({ order }) => {
  const [expiresIn, setExpiresIn] = useState(0);

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

  if (expiresIn < 0) {
    return <div>Order has expired</div>
  }

  return (
    <div>Time left to pay: {expiresIn}</div>
  );
}

OrderShow.getInitialProps = async (context, client, currentUser) => {
  const { orderId } = context.query;
  
  const { data } = await client.get(`/api/orders/${orderId}`);
  console.log(data);

  return { order: data }
}

export default OrderShow;