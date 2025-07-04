import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from '@tickets-packages/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;
  onMessage(
    data: {
      id: string;
      status: OrderStatus;
      userId: string;
      expireAt: string;
      version: number;
      ticket: { id: string; price: number };
    },
    msg: Message
  ) {}
}
