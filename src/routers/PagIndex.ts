import { Router } from 'express';
import { bodyValidator, queryValidator } from '../middlewares/validator';
import * as yup from 'yup';
import { indexPagController } from '../controllers';
import { checkSession } from '../middlewares/checkSession';
import { checkAuth } from '../middlewares/checkAuth';
import { upload } from '../storage';

export const indexPagRouter = Router({ mergeParams: true });

//update mision, vision
indexPagRouter.patch('/Info', bodyValidator(yup.object().shape({
	mision: yup.string(),
	vision: yup.string(),
})), checkSession, checkAuth(['Admin']), indexPagController.updateIndex);

//add section
indexPagRouter.patch('/AddSection', bodyValidator(yup.object().shape({
	name: yup.string().required(),
	description: yup.string().required(),
	photo: yup.string()
})), checkSession, checkAuth(['Admin']), indexPagController.addSection);

//delete section
indexPagRouter.patch('/DeleteSection', queryValidator(yup.object().shape({
	sectionId: yup.string().required(),
})), checkSession, checkAuth(['Admin']), indexPagController.deleteSection);

//get info index
indexPagRouter.get('/', indexPagController.getInfoIndex);

indexPagRouter.post('/upload-logo',
	checkSession,
	checkAuth(['Admin']),
	upload.single('image'),
	indexPagController.uploadLogo
);

indexPagRouter.get('/get-logo',
	indexPagController.getLogo
);