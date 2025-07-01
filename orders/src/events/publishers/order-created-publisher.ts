import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from '@tickets-packages/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
