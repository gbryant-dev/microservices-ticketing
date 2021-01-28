import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { listenerCount } from 'events';
import { TicketCreatedListener } from './events/ticket-created-listener';


console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

stan.on('close', () => {
  console.log('NATS connection closed!');
  process.exit();
});

stan.on('connect', () => {
  console.log('Listener connected to NATS')

  new TicketCreatedListener(stan).listen();

});


process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

