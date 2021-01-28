import { Publisher, Subjects, TicketUpdatedEvent } from '@gbtickets/common';


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TickedUpdated;
}


