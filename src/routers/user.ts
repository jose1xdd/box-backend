import { Router } from 'express';
import { userController } from '../controllers/user';
import {
	bodyValidator,
	paramsValidator,
	queryValidator
} from '../middlewares/validator';
import * as yup from 'yup';
import { birthDateRegex, dateRegex } from '../codeUtils/globals';
import { checkSession } from '../middlewares/checkSession';
import { checkAuth } from '../middlewares/checkAuth';
import { upload } from '../storage';

export const userRouter = Router({ mergeParams: true });

//Create deportista
userRouter.post('/Deportista', bodyValidator(yup.object().shape({
	name: yup.string().required(),
	lastName: yup.string().required(),
	birthDate: yup.string().required().matches(birthDateRegex),
	cedula: yup.string().required().min(0),
	weight: yup.number().required().min(0),
	email: yup.string().required().email(),
	club: yup.string(),
	weightCategory: yup.string(),
	phone: yup.string().required(),
	address: yup.string().required(),
}).noUnknown(true)), checkSession, checkAuth(['Admin']), userController.createDeportista);

//Create admin
userRouter.post('/Admin', bodyValidator(yup.object().shape({
	name: yup.string().required(),
	lastName: yup.string().required(),
	birthDate: yup.string().required().matches(birthDateRegex),
	cedula: yup.string().required().min(0),
	email: yup.string().required().email(),
	phone: yup.string().required(),
	address: yup.string().required(),
}).noUnknown(true)), userController.createAdmin);

//Create trainer
userRouter.post('/Entrenador', bodyValidator(yup.object().shape({
	name: yup.string().required(),
	lastName: yup.string().required(),
	birthDate: yup.string().required().matches(birthDateRegex),
	cedula: yup.string().required().min(0),
	email: yup.string().required().email(),
	phone: yup.string().required(),
	address: yup.string().required(),
}).noUnknown(true)), checkSession, checkAuth(['Admin']), userController.createTrainer);

//Create generic user
userRouter.post('/generic', bodyValidator(yup.object().shape({
	name: yup.string().required(),
	lastName: yup.string().required(),
	birthDate: yup.string().required().matches(birthDateRegex),
	cedula: yup.string().required().min(0),
	email: yup.string().required().email(),
	phone: yup.string().required(),
	address: yup.string().required(),
	role: yup.string().required(),
}).noUnknown(true)), checkSession, checkAuth(['Admin']), userController.createGenericUser);

//Update a deportista
userRouter.patch('/Deportista', queryValidator(yup.object().shape({
	userId: yup.string().required(),
}).noUnknown(true)), bodyValidator(yup.object().shape({
	name: yup.string(),
	lastName: yup.string(),
	phone: yup.string(),
	address: yup.string(),
	weight: yup.number().min(0),
	club: yup.string(),
	weightCategory: yup.string()
}).noUnknown(true)), checkSession, checkAuth([]), userController.updateDeportista);

//Update an generic User
userRouter.patch('/', queryValidator(yup.object().shape({
	userId: yup.string().required(),
}).noUnknown(true)), bodyValidator(yup.object().shape({
	name: yup.string(),
	lastName: yup.string(),
	phone: yup.string(),
	address: yup.string(),
}).noUnknown(true)), checkSession, checkAuth([]), userController.updateUser);

//get an user by id
userRouter.get('/', queryValidator(yup.object().shape({
	userId: yup.string().required(),
}).noUnknown(true)), checkSession, checkAuth(['Admin', 'Entrenador', 'Deportista']), userController.getUser);

//get the user List
userRouter.get('/List', queryValidator(yup.object().shape({
	limit: yup.string(),
	role: yup.string()
}).noUnknown(true)), checkSession, checkAuth(['Admin', 'Entrenador']), userController.getUsersList);

//disable an user
userRouter.delete('/Delete', queryValidator(yup.object().shape({
	userId: yup.string().required(),
}).noUnknown(true)), checkSession, checkAuth(['Admin']), userController.disableUser);

//create test to user
userRouter.post('/test', bodyValidator(yup.object().shape({
	userId: yup.string().required(),
	date: yup.string().required().matches(dateRegex),
	test: yup.array().of(yup.object().shape({
		criteryId: yup.string().required(),
		repeats: yup.number().required().min(0)
	})).required()
}).noUnknown(true)), checkSession, checkAuth(['Admin']), userController.createTestUser);

//download user deportistas
userRouter.get('/download/Deportistas', userController.descargarUserDeportistas);

//download user entrenador
userRouter.get('/download/Entrenador', userController.descargarUserEntrenadores);

userRouter.post('/:userId/uploadImage',
	checkSession,
	checkAuth(['Admin', 'Entrenador', 'Deportista']),
	paramsValidator(yup.object().shape({
		userId: yup.string().required()
	}).noUnknown(true)),
	upload.array('image'),
	userController.uploadProfilePhoto);

userRouter.get('/:userId/getUserImage',
	checkSession,
	checkAuth(['Admin', 'Entrenador', 'Deportista']),
	paramsValidator(yup.object().shape({
		userId: yup.string().required()
	}).noUnknown(true)),
	userController.getProfilePhoto);

userRouter.post('/generate-password-code',
	bodyValidator(yup.object().shape({
		email: yup.string().email()
	}).noUnknown(true)),
	userController.generatePasswordCode
);

userRouter.patch('/update-password',
	bodyValidator(yup.object().shape({
		email: yup.string().email(),
		code: yup.string(),
		password: yup.string()
	})),
	userController.updatePassword
);
