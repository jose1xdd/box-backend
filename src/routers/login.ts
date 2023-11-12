import { Router } from 'express';
import { bodyValidator } from '../middlewares/validator';
import * as yup from 'yup';
import { loginController } from '../controllers/login';

export const loginRouter = Router({ mergeParams: true });

loginRouter.post('/', bodyValidator(yup.object().shape({
	email: yup.string().required().email(),
	password: yup.string().required(),
}).noUnknown(true)), loginController.login);