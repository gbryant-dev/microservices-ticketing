import express from 'express';

const app = express();

app.use(express.json());

const port = 3000;

app.listen(3000, () => {
    console.log(`Listening on port ${port}`)
});