import express from 'express';
import { userRouter } from './user';
import { loginRouter } from './login';

export const mainRouter = express.Router({ mergeParams: true });
mainRouter.use('/users', userRouter);
mainRouter.use('/login', loginRouter);