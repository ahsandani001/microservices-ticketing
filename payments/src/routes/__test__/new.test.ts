import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Order } from '../../models/order';
import { OrderStatus } from '@tickets-packages/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payments';

// jest.mock('../../__mocks__/stripe.ts');

it('returns a 404 when purchasing an order does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup())
    .send({
      token: 'asfasdf',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup())
    .send({
      token: 'asfasdf',
      orderId: order.id,
    })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
    userId,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup(userId))
    .send({
      token: 'asfasdf',
      orderId: order.id,
    })
    .expect(400);
});

it('returns a 201 with valid input', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = 10;

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price,
    status: OrderStatus.Created,
    userId,
  });
  await order.save();

  const paymentData = await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    });
  expect(201);

  const payment = Payment.build({
    orderId: order.id,
    stripeId: paymentData.body.id,
  });
  await payment.save();

  const stripeCharges = await stripe.paymentIntents.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find((charge: any) => {
    return charge.amount === price * 100;
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge.currency).toEqual('usd');
  const paymentInfo = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge.id,
  });

  expect(paymentInfo).not.toBeNull();
});
