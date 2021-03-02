import Router from 'next/router';
import React from 'react'
import useRequest from '../../hooks/useRequest';

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id
    },
    onSuccess: (order) => Router.push(`/orders/${order.id}`)
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>{ticket.price}</h4>
      {errors}
      <button onClick={doRequest} className="btn btn-primary">Purchase</button>
    </div>
  );
}


TicketShow.getInitialProps = async (context, client, currentUser) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data }
}

// export async function getServerSideProps (context) {

//   const client = buildClient(context);

//   const { ticketId } = context.params;

//   // console.log(ticketId, client);
//   const { data } = await client.get(`/api/tickets/${ticketId}`);

//   return {
//     props: {
//       ticket: data
//     }
//   }
// }

export default TicketShow;