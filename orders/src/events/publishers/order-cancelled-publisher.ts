import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from '@tickets-packages/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
