import { Router } from 'express';
import { userController } from '../controllers/user';
import { bodyValidator, queryValidator } from '../middlewares/validator';
import * as yup from 'yup';
import { dateRegex } from '../codeUtils/globals';
import { checkSession } from '../middlewares/checkSession';
import { checkAuth } from '../middlewares/checkAuth';
import { checkEditPermition } from '../middlewares/checkEditPermisions';

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
}).noUnknown(true)), checkSession, checkAuth(['Admin']), userController.create);

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
}).noUnknown(true)), checkSession, checkAuth(['Admin']), userController.create);

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
}).noUnknown(true)), checkSession, checkAuth(['Admin']), userController.create);

//Update an user
userRouter.patch('/', queryValidator(yup.object().shape({
	userId: yup.string().required(),
}).noUnknown(true)), bodyValidator(yup.object().shape({
	name: yup.string(),
	lastname: yup.string(),
	phone: yup.string(),
	address: yup.string(),
}).noUnknown(true)), checkSession, checkAuth([]), checkEditPermition, userController.updateUser);