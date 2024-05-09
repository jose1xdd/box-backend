import { Router } from 'express';
import { bodyValidator, paramsValidator } from '../middlewares/validator';
import * as yup from 'yup';
import { checkSession } from '../middlewares/checkSession';
import { checkAuth } from '../middlewares/checkAuth';
import { roleController } from '../controllers/role';

export const roleRouter = Router({ mergeParams: true });

roleRouter.delete('/:id', checkSession, paramsValidator(yup.object().shape({
	id: yup.string().required()
})), roleController.deleteRol);

roleRouter.post('/', bodyValidator(yup.object().shape({
	name: yup.string().required(),
})), checkSession, checkAuth(['Admin']), roleController.createRol);

roleRouter.get('/', checkSession, checkAuth(['Admin']), roleController.getRol);

