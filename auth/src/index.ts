import express from 'express';
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';

import { errorHandler } from './middleware/error-handler';

const app = express();

app.use(express.json());
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.use(errorHandler);

const port = 3000;

app.listen(3000, () => {
    console.log(`Listening on port ${port}!`);
});