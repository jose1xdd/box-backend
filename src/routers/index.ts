import express from 'express';
import { userRouter } from './user';
import { loginRouter } from './login';
import { clubsRouter } from './club';
import { weightCategoryRouter } from './weightCategory';
import { testCriteryRouter } from './testCritery';
import { indexPagRouter } from './PagIndex';
import { roleRouter } from './role';
import { eventRouter } from './event';
import { saveUserImages, upload } from '../storage';
import { logger } from '../logger/winston';

export const mainRouter = express.Router({ mergeParams: true });
mainRouter.post('/test', upload.array('image'), async (req, res)=>{
	const files = req.files as Express.Multer.File[];
	for(const file of files){
		await saveUserImages(file, '123');
	}
	logger.info(files);
	res.send({ ok: 'ok' });

});
mainRouter.use('/users', userRouter);
mainRouter.use('/login', loginRouter);
mainRouter.use('/club', clubsRouter);
mainRouter.use('/weightCategory', weightCategoryRouter);
mainRouter.use('/testCritery', testCriteryRouter);
mainRouter.use('/indexPag', indexPagRouter);
mainRouter.use('/role', roleRouter);
mainRouter.use('/event', eventRouter);
mainRouter.get('/', async (req, res)=>{
	res.send('API BOX V1 ');
});