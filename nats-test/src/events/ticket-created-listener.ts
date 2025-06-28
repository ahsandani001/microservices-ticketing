import { Listener } from './base-listener';
import { Message } from 'node-nats-streaming';

export class TicketCreatedListener extends Listener {
  subject = 'ticket:created';
  queueGroupName = 'payments-service';

  onMessage(data: any, msg: Message): void {
    console.log('Event Data!', data);

    msg.ack();
  }
}
