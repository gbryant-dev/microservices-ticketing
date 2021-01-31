import { Publisher, OrderCreatedEvent, Subjects } from '@gbtickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
