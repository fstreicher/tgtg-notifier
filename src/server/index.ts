import express from 'express';
import updateRouter from './update-notification';

const app = express();

app.use(express.json());
app.use('/pause-notifications', updateRouter);

export default app;

