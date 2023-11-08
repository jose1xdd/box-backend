import { capture } from '../middlewares/errorhandler';

export const testController = {

	test: capture((req, res)=>{
		const { data } = req.body;
		res.send({ data: data });
	})

};