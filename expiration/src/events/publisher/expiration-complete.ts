import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@tickets-packages/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
