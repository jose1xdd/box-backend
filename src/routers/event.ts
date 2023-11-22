import { Router } from 'express';
import {
	bodyValidator,
	paramsValidator,
	queryValidator
} from '../middlewares/validator';
import * as yup from 'yup';
import { checkSession } from '../middlewares/checkSession';
import { checkAuth } from '../middlewares/checkAuth';
import { eventController } from '../controllers/event';
import { dateRegex } from '../codeUtils/globals';

export const eventRouter = Router({ mergeParams: true });

//create a event reunion
eventRouter.post('/meet', bodyValidator(yup.object().shape({
	name: yup.string().required(),
	description: yup.string().required(),
	trainer: yup.string().required(),
	startsAt: yup.string().required().matches(dateRegex),
	endsAt: yup.string().required().matches(dateRegex),
	participants: yup.array().required().min(1)
}).noUnknown(true)), checkSession, checkAuth(['Admin']), eventController.createEventMeet);

//create a event combat
eventRouter.post('/battle', bodyValidator(yup.object().shape({
	name: yup.string().required(),
	description: yup.string().required(),
	trainer: yup.string().required(),
	weigthCategory: yup.string().required(),
	startsAt: yup.string().required().matches(dateRegex),
	endsAt: yup.string().required().matches(dateRegex),
	combats: yup.array().required().min(1)
}).noUnknown(true)), checkSession, checkAuth(['Admin']), eventController.createEventBattle);

//get Events
eventRouter.get('/', paramsValidator(yup.object().shape({
	limit: yup.string()
}).noUnknown(true)), checkSession, checkAuth([]), eventController.getEvent);

//get Event by Id
eventRouter.get('/Info', queryValidator(yup.object().shape({
	eventId: yup.string().required()
}).noUnknown(true)), checkSession, checkAuth([]), eventController.getEventById);
