import { Index } from '../database/models';
import { capture } from '../middlewares/errorhandler';
export const indexPagController = {

	//create a test critery
	updateIndex: capture(async (req, res)=>{
		const data = req.body;
		const index = await Index.findOne();
		let result;

		//Falta setear las imagenes de cada seccion, cuando se tenga el storage de firebase
		if(index) {
			result = await Index.findByIdAndUpdate(index['_id'], data, { new: true });
		}else {
			result = await Index.create(data);
		}
		res.send({ index: result });
	}),

	//create a test critery
	getInfoIndex: capture(async (req, res)=>{
		const result = await Index.findOne();
		let data;
		if(!result) {
			data = {};
		} else {
			data = result;
		}
		res.send({ infoIndex: data });
	}),
};