import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signup())
    .send({
      title: 'asdasf',
      price: 20,
    })
    .expect(404);
});
it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'asdasf',
      price: 20,
    })
    .expect(401);
});
it('returns a 401 if the user does not own the ticket', async () => {
  const ticketResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: 'adsfasfd', price: 20 });

  await request(app)
    .put(`/api/tickets/${ticketResponse.body.id}`)
    .set('Cookie', global.signup())
    .send({ title: 'adsfasdfsaf', price: 40 })
    .expect(401);
});
it('returns a 400 if the user provided invalid title and price', async () => {
  const cookie = global.signup();

  const ticket = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'adsfasfd', price: 20 });

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 20 })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', cookie)
    .send({ price: 20 })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'asdfasdf', price: -10 })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'asdfasdf' })
    .expect(400);
});
it('updates the ticket provided the valid inputs', async () => {
  const cookie = global.signup();

  const ticket = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'adsfasfd', price: 20 });

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'new ticket', price: 100 })
    .expect(200);

  const updatedTicket = await request(app)
    .get(`/api/tickets/${ticket.body.id}`)
    .send({})
    .expect(200);

  expect(updatedTicket.body.title).toEqual('new ticket');
  expect(updatedTicket.body.price).toEqual(100);
});

it('publishes an event', async () => {
  const cookie = global.signup();

  const ticket = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'adsfasfd', price: 20 });

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'new ticket', price: 100 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});