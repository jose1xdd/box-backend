import express from 'express';
import { userRouter } from './user';
import { loginRouter } from './login';
import { clubsRouter } from './club';
import { weightCategoryRouter } from './weightCategory';
import { testCriteryRouter } from './testCritery';

export const mainRouter = express.Router({ mergeParams: true });
mainRouter.use('/users', userRouter);
mainRouter.use('/login', loginRouter);
mainRouter.use('/club', clubsRouter);
mainRouter.use('/weightCategory', weightCategoryRouter);
mainRouter.use('/testCritery', testCriteryRouter);