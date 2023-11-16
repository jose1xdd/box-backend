import { Router } from 'express';
import { userController } from '../controllers/user';
import { bodyValidator, queryValidator } from '../middlewares/validator';
import * as yup from 'yup';
import { dateRegex } from '../codeUtils/globals';
import { checkSession } from '../middlewares/checkSession';
import { checkAuth } from '../middlewares/checkAuth';
import { checkEditPermition } from '../middlewares/checkEditPermisions';

export const userRouter = Router({ mergeParams: true });

//Create deportista
userRouter.post('/Deportista', bodyValidator(yup.object().shape({
	name: yup.string().required(),
	lastName: yup.string().required(),
	birthDate: yup.string().required().matches(dateRegex),
	cedula: yup.string().required(),
	weight: yup.number().required(),
	email: yup.string().required().email(),
	club: yup.string(),
	weightCategory: yup.string(),
	phone: yup.string().required(),
	address: yup.string().required(),
	password: yup.string().required(),
}).noUnknown(true)), checkSession, checkAuth(['Admin']), userController.createDeportista);

//Create admin
userRouter.post('/Admin', bodyValidator(yup.object().shape({
	name: yup.string().required(),
	lastName: yup.string().required(),
	birthDate: yup.string().required().matches(dateRegex),
	cedula: yup.string().required(),
	email: yup.string().required().email(),
	phone: yup.string().required(),
	address: yup.string().required(),
}).noUnknown(true)), checkSession, checkAuth(['Admin']), userController.createAdmin);

//Create trainer
userRouter.post('/Entrenador', bodyValidator(yup.object().shape({
	name: yup.string().required(),
	lastName: yup.string().required(),
	birthDate: yup.string().required().matches(dateRegex),
	cedula: yup.string().required(),
	email: yup.string().required().email(),
	phone: yup.string().required(),
	address: yup.string().required(),
}).noUnknown(true)), checkSession, checkAuth(['Admin']), userController.createTrainer);

//Update a deportista
userRouter.patch('/Deportista', queryValidator(yup.object().shape({
	userId: yup.string().required(),
}).noUnknown(true)), bodyValidator(yup.object().shape({
	name: yup.string(),
	lastname: yup.string(),
	phone: yup.string(),
	address: yup.string(),
	weight: yup.number(),
	club: yup.string(),
	weightCategory: yup.string()
}).noUnknown(true)), checkSession, checkAuth([]), checkEditPermition, userController.updateDeportista);

//Update an generic User
userRouter.patch('/', queryValidator(yup.object().shape({
	userId: yup.string().required(),
}).noUnknown(true)), bodyValidator(yup.object().shape({
	name: yup.string(),
	lastname: yup.string(),
	phone: yup.string(),
	address: yup.string(),
}).noUnknown(true)), checkSession, checkAuth([]), checkEditPermition, userController.updateUser);

//get an user by id
userRouter.get('/', queryValidator(yup.object().shape({
	userId: yup.string().required(),
}).noUnknown(true)), checkSession, checkAuth(['Admin', 'Entrenadores']), userController.getUser);

//get the user List
userRouter.get('/List', queryValidator(yup.object().shape({
	limit: yup.string(),
	role: yup.string()
}).noUnknown(true)), checkSession, checkAuth(['Admin', 'Entrenadores']), userController.getUsersList);
