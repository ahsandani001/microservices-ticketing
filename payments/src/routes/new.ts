import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@tickets-packages/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payments';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser?.id) throw new NotAuthorizedError();

    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestError('Cannot pay for a cancelled order');

    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.price * 100,
      currency: 'usd',
      confirm: true,
      payment_method_data: {
        type: 'card',
        card: {
          token: token,
        },
      },
      description: `Payment for order ${order.id}`,
      return_url: 'https://ticketing.dev',
    });

    const payment = await Payment.build({
      orderId,
      stripeId: paymentIntent.id,
    });
    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
