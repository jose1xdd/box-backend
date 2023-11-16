
import { weightCategory } from '../database/models/weightCategory';
import { logger } from '../logger/winston';
import { capture } from '../middlewares/errorhandler';
export const weightCategoryController = {

	//create an initial user
	createWeightCategory: capture(async (req, res)=>{
		const data = req.body;
		const minWeight = parseInt(data.minWeight);
		const maxWeight = parseInt(data.maxWeight);

		//If weight is not valid
		if(minWeight >= maxWeight) throw Error('El peso minimo no puede ser mayor al maximo');
		const exist = await weightCategory.existWeightCategory(data);
		//If already exist
		logger.info(exist);
		logger.info(data);
		if(exist) throw Error('Ya existe una categora de peso con esas caracteristicas');
		//create the new category
		const result = await weightCategory.create(data);
		res.send({ weightCategory: result });
	}),
};