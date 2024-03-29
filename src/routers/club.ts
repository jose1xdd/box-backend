import { Router } from 'express';
import { bodyValidator, queryValidator } from '../middlewares/validator';
import * as yup from 'yup';
import { checkSession } from '../middlewares/checkSession';
import { checkAuth } from '../middlewares/checkAuth';
import { clubsController } from '../controllers/clubs';

export const clubsRouter = Router({ mergeParams: true });

//create a club
clubsRouter.post('/', bodyValidator(yup.object().shape({
	name: yup.string().required(),
	description: yup.string().required(),
	photo: yup.string()
})), checkSession, checkAuth(['Admin']), clubsController.create);

//update a club
clubsRouter.patch('/', queryValidator(yup.object().shape({
	clubId: yup.string().required(),
})), bodyValidator(yup.object().shape({
	name: yup.string(),
	description: yup.string(),
	photo: yup.string()
})), checkSession, checkAuth(['Admin']), clubsController.updateClub);

// Delete a club
clubsRouter.delete('/Delete', queryValidator(yup.object().shape({
	clubId: yup.string().required(),
})), checkSession, checkAuth(['Admin']), clubsController.deleteClub);

//get club by Id
clubsRouter.get('/', queryValidator(yup.object().shape({
	clubId: yup.string().required(),
})), checkSession, checkAuth([]), clubsController.updateClub);

//get club list
clubsRouter.get('/List', queryValidator(yup.object().shape({
	limit: yup.string(),
})), checkSession, checkAuth([]), clubsController.getClubList);