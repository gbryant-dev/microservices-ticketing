import { Publisher, Subjects, TicketCreatedEvent } from '@gbtickets/common';


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TickedCreated;
}


