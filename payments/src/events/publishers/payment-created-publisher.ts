import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from '@tickets-packages/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
