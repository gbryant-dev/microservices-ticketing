
import { app } from './app';
import mongoose from 'mongoose';
import { natsWrapper } from './nats-wrapper';

const start = async () => {

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is not defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
  }
  
  try {
    await natsWrapper.connect('ticketing', 'djflsd', 'http://nats-srv:4222');

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGTERM', () => natsWrapper.client.close());
    process.on('SIGINT', () => natsWrapper.client.close());


    await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
    });
    console.log('Connected to MongoDB');
  } catch (err) {
      console.error(err);
  }
}

const port = 3000;

app.listen(3000, () => {
    console.log(`Listening on port ${port}!`);
});

start();