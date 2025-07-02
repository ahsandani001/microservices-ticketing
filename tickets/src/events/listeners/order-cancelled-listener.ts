import {
  Listener,
  OrderCancelledEvent,
  Subjects,
} from '@tickets-packages/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: { id: string; version: number; ticket: { id: string } },
    msg: Message
  ) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) throw new Error('Ticket not found!');

    ticket.set({ orderId: undefined });
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.id,
      version: ticket.version,
      orderId: ticket.id,
    });

    msg.ack();
  }
}
