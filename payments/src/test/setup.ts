import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';


declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
    }
  }
}

let mongo: any;



jest.mock('../nats-wrapper');

beforeAll(async () => {
  process.env.JWT_KEY = 'testing'
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }

})

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});


global.signin = (id?: string) => {
  // Build a JWT payload { id, email, iat }

  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object
  const session = { jwt: token };

  // Convert session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const encoded = Buffer.from(sessionJSON).toString('base64');

  // return a string with cookie and encoded data
  return [`express:sess=${encoded}`];
}