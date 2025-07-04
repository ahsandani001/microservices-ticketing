import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from '@tickets-packages/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: {
      id: string;
      status: OrderStatus;
      userId: string;
      expireAt: string;
      version: number;
      ticket: { id: string; price: number };
    },
    msg: Message
  ) {
    const delay = new Date(data.expireAt).getTime() - new Date().getTime();
    console.log('waiting this many milliseconds to process the job', delay);

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}
