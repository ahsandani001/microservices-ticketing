import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@tickets-packages/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
