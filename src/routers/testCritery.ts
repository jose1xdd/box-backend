import { Router } from 'express';
import { bodyValidator, queryValidator } from '../middlewares/validator';
import * as yup from 'yup';
import { checkSession } from '../middlewares/checkSession';
import { checkAuth } from '../middlewares/checkAuth';
import { testCriteryController } from '../controllers/testCritery';

export const testCriteryRouter = Router({ mergeParams: true });

//create a critery
testCriteryRouter.post('/', bodyValidator(yup.object().shape({
	name: yup.string().required(),
})), checkSession, checkAuth(['Admin']), testCriteryController.createCritery);

// Delete a critery
testCriteryRouter.delete('/', queryValidator(yup.object().shape({
	criteryId: yup.string().required(),
})), checkSession, checkAuth(['Admin']), testCriteryController.deleteCritery);

//get critery list
testCriteryRouter.get('/', queryValidator(yup.object().shape({
	limit: yup.string(),
})), checkSession, checkAuth([]), testCriteryController.getCriteryList);