import express from 'express';
import { userRouter } from './user';
import { loginRouter } from './login';
import { clubsRouter } from './club';

export const mainRouter = express.Router({ mergeParams: true });
mainRouter.use('/users', userRouter);
mainRouter.use('/login', loginRouter);
mainRouter.use('/club', clubsRouter);