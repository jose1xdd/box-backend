import { Router } from 'express';
import { bodyValidator } from '../middlewares/validator';
import * as yup from 'yup';
import { checkSession } from '../middlewares/checkSession';
import { checkAuth } from '../middlewares/checkAuth';
import { weightCategoryController } from '../controllers/weightCategory';

export const weightCategoryRouter = Router({ mergeParams: true });

weightCategoryRouter.post('/', bodyValidator(yup.object().shape({
	name: yup.string().required(),
	minWeight: yup.number().required(),
	maxWeight: yup.number().required(),
}).noUnknown(true)), checkSession, checkAuth(['Admin']), weightCategoryController.createWeightCategory);
