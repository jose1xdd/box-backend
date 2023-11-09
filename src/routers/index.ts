import express from 'express';
import { userRouter } from './user';

export const mainRouter = express.Router({ mergeParams: true });
mainRouter.use('/users', userRouter);