import { Router } from 'express';
import { bodyValidator } from '../middlewares/validator';
import * as yup from 'yup';
import { indexPagController } from '../controllers';
import { checkSession } from '../middlewares/checkSession';
import { checkAuth } from '../middlewares/checkAuth';

export const indexPagRouter = Router({ mergeParams: true });

//update index pag
indexPagRouter.post('/', bodyValidator(yup.object().shape({
	mision: yup.string(),
	vision: yup.string(),
	seccion: yup.array(),
}).noUnknown(true)), checkSession, checkAuth(['Admin']), indexPagController.updateIndex);

//get info index
indexPagRouter.get('/', indexPagController.getInfoIndex);