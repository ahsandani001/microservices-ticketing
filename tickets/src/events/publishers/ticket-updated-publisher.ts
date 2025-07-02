import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@tickets-packages/common';
import { natsWrapper } from '../../nats-wrapper';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
