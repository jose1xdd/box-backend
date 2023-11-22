import { Router } from 'express';
import {
	bodyValidator,
	paramsValidator,
	queryValidator
} from '../middlewares/validator';
import * as yup from 'yup';
import { checkSession } from '../middlewares/checkSession';
import { checkAuth } from '../middlewares/checkAuth';
import { weightCategoryController } from '../controllers/weightCategory';

export const weightCategoryRouter = Router({ mergeParams: true });

//create a weight category
weightCategoryRouter.post('/', bodyValidator(yup.object().shape({
	name: yup.string().required(),
	minWeight: yup.number().required().min(0),
	maxWeight: yup.number().required().min(0),
}).noUnknown(true)), checkSession, checkAuth(['Admin']), weightCategoryController.createWeightCategory);

//update a weight category
weightCategoryRouter.patch('/', queryValidator(yup.object().shape({
	weightCategoryId: yup.string().required(),
}).noUnknown(true)), bodyValidator(yup.object().shape({
	name: yup.string(),
	minWeight: yup.number().min(0),
	maxWeight: yup.number().min(0),
}).noUnknown(true)), checkSession, checkAuth(['Admin']), weightCategoryController.updateWeightCategory);

//get a weight category list
weightCategoryRouter.get('/List', paramsValidator(yup.object().shape({
	minWeight: yup.number().min(0),
	maxWeight: yup.number().min(0),
}).noUnknown(true)), checkSession, checkAuth([]), weightCategoryController.getWeightCategories);

//get a weight category list
weightCategoryRouter.get('/', queryValidator(yup.object().shape({
	weightCategoryId: yup.string().required(),
}).noUnknown(true)), checkSession, checkAuth([]), weightCategoryController.getWeightCategoryById);

//delete a weight category
weightCategoryRouter.delete('/', queryValidator(yup.object().shape({
	weightCategoryId: yup.string().required(),
}).noUnknown(true)), checkSession, checkAuth([]), weightCategoryController.deleteWeightCategory);
