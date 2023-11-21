import { Router } from 'express';
import { bodyValidator } from '../middlewares/validator';
import * as yup from 'yup';
import { checkSession } from '../middlewares/checkSession';
import { checkAuth } from '../middlewares/checkAuth';
import { roleController } from '../controllers/role';

export const roleRouter = Router({ mergeParams: true });

roleRouter.post('/', bodyValidator(yup.object().shape({
	name: yup.string().required(),
}).noUnknown(true)), checkSession, checkAuth(['Admin']), roleController.createRol);