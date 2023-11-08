import { Router } from 'express';
import { testController } from '../controllers/test';
import { bodyValidator } from '../middlewares/validator';
import * as yup from 'yup';

export const testRouter = Router({ mergeParams: true });

testRouter.post('/', bodyValidator(yup.object().shape({
	data: yup.number().required()
}).noUnknown(true)), testController.test);