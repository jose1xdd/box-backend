import { Router } from 'express';
import { bodyValidator } from '../middlewares/validator';
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
