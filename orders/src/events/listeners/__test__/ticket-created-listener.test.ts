import { TicketCreatedEvent, TicketUpdatedEvent } from "@gbtickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";

const setup = async () => {
  
  // Create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // Create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: mongoose.Types.ObjectId().toHexString()
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg }

}


it('creates and saves a ticket', async () => {
  
  const { listener, data, msg } = await setup();
  // Call the onMessage function with the data and message objects
  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);

  // Write assertion to make sure the ticket was created
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);

})

it('acks the message', async () => {

  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
  
  // Call the onMessage function with the data and message objects

  // Write assertion to make sure ack function was called
  
});

