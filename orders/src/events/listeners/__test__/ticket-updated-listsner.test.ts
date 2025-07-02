import { Ticket } from '../../../models/ticket';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { TicketUpdatedEvent } from '@tickets-packages/common';

const setup = async () => {
  // create an instance of listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // create a fake data event
  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'new concert',
    price: 25,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, msg };
};

it('finds, update and saves the ticket', async () => {
  const { listener, data, ticket, msg } = await setup();

  // call the onMessage function with data and message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ticket was created
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket?.price).toEqual(data.price);
  expect(updatedTicket?.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with data and message object
  await listener.onMessage(data, msg);

  // write assertions to make ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has skipped', async () => {
  const { listener, data, ticket, msg } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
