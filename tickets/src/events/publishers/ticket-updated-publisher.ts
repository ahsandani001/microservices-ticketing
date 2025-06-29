import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@tickets-packages/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
