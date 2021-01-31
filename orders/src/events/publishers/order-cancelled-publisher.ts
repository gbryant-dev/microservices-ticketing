import { Subjects, Publisher, OrderCancelledEvent } from '@gbtickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}

