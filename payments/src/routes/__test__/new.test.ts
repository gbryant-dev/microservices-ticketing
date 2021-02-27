import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@gbtickets/common';

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'test',
      orderId: mongoose.Types.ObjectId().toHexString()
    })
    .expect(404);

});

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    version: 0,
    status: OrderStatus.Created
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'test',
      orderId: order.id
    })
    .expect(401);

});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    price: 20,
    version: 0,
    status: OrderStatus.Cancelled
  });

  await order.save();

  await request(app)
  .post('/api/payments')
  .set('Cookie', global.signin(userId))
  .send({
    orderId: order.id,
    token: 'test'
  })
  .expect(400);

})
