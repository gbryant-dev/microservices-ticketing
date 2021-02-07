import { Listener, OrderCancelledEvent, Subjects } from "@gbtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketCreatedPublisher } from "../publishers/ticket-created-publisher";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";


export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Find ticket with id
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Reset orderId
    ticket.set({ orderId: undefined });

    await ticket.save();

    // Publish event
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      userId: ticket.userId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version
    });

    // Acknowledge event
    msg.ack();

  }
}