import { Listener } from './base-listener';
import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from './tickets-created-event';
import { Subjects } from './subjects';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
    console.log('Event Data!', data);

    msg.ack();
  }
}
