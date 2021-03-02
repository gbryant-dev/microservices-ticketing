import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@gbtickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { stripe } from '../stripe';
import { Order } from '../models/order';

const router = express.Router();

router.post('/api/payments',
  requireAuth,
  [ body('token').not().isEmpty(), body('orderId').not().isEmpty() ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot for pay for a cancelled order');
    }

    const response = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token
    });

    res.send(response);

  });


  export { router as createChargeRouter };