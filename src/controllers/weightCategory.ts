
import { WeightCategory } from '../database/models/weightCategory';
import { capture } from '../middlewares/errorhandler';
export const weightCategoryController = {

	//create an initial user
	createWeightCategory: capture(async (req, res)=>{
		const data = req.body;
		const minWeight = parseInt(data.minWeight);
		const maxWeight = parseInt(data.maxWeight);

		//If weight is not valid
		if(minWeight >= maxWeight) throw Error('El peso minimo no puede ser mayor al maximo');
		const exist = await WeightCategory.existWeightCategory(data);
		//If already exist
		if(exist) throw Error('Ya existe una categora de peso con esas caracteristicas');
		//create the new category
		const result = await WeightCategory.create(data);
		res.send({ weightCategory: result });
	}),

	//get Weight categories
	getWeightCategories: capture(async (req, res)=>{
		const { minWeight, maxWeight } = req.query;
		const data = {};
		if(typeof minWeight != typeof maxWeight) throw Error('Se han enviado datos incompletos (pesos)');
		else {
			if(minWeight && maxWeight){
				if(minWeight > maxWeight) throw Error('No puede existir un minWeight mayor a maxWeght');
				data['minWeight'] = minWeight;
				data['maxWeight'] = maxWeight;
			}
		}
		const result = await WeightCategory.getWeightCategoriesByWeight(data);
		res.send({ weightCategory: result });
	}),
};