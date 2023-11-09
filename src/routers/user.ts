import { Router } from 'express';
import { userController } from '../controllers/user';
import { bodyValidator } from '../middlewares/validator';
import * as yup from 'yup';
import { dateRegex } from '../codeUtils/globals';

export const userRouter = Router({ mergeParams: true });

userRouter.post('/Deportista', bodyValidator(yup.object().shape({
	name: yup.string().required(),
	lastName: yup.string().required(),
	birthDate: yup.string().required().matches(dateRegex),
	cedula: yup.string().required(),
	weight: yup.number().required(),
	email: yup.string().required().email(),
	phone: yup.string().required(),
	address: yup.string().required(),
	password: yup.string().required(),
}).noUnknown(true)), userController.create);

userRouter.post('/Admin', bodyValidator(yup.object().shape({
	name: yup.string().required(),
	lastName: yup.string().required(),
	birthDate: yup.string().required().matches(dateRegex),
	cedula: yup.string().required(),
	role: yup.string().required().oneOf(['Admin']),
	email: yup.string().required().email(),
	phone: yup.string().required(),
	address: yup.string().required(),
	password: yup.string().required(),
}).noUnknown(true)), userController.create);

userRouter.post('/Entrenador', bodyValidator(yup.object().shape({
	name: yup.string().required(),
	lastName: yup.string().required(),
	birthDate: yup.string().required().matches(dateRegex),
	cedula: yup.string().required(),
	role: yup.string().required().oneOf(['Entrenador']),
	email: yup.string().required().email(),
	phone: yup.string().required(),
	address: yup.string().required(),
	password: yup.string().required(),
}).noUnknown(true)), userController.create);