
import mongoose from 'mongoose';
import { WeightCategory } from '../database/models/weightCategory';
import { capture } from '../middlewares/errorhandler';
import { logger } from '../logger/winston';
import { User } from '../database/models/user';
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

	//get Weight category by id
	getWeightCategoryById: capture(async (req, res)=>{
		const weightCategoryId = req.query.weightCategoryId as string;
		if(!mongoose.Types.ObjectId.isValid(weightCategoryId)) throw Error('El ID de la categoria de peso no es valido');
		const result = await WeightCategory.findById(weightCategoryId);
		if(!result) throw Error('No existe una categoria con ese Id');
		res.send({ Category: result });
	}),

	//update weight category
	updateWeightCategory: capture(async (req, res)=>{
		const weightCategoryId = req.query.weightCategoryId as string;
		const data = req.body;
		const minWeight = parseInt(data.minWeight);
		const maxWeight = parseInt(data.maxWeight);

		//If weightCategoryId is valid
		logger.info(data);
		if(!mongoose.Types.ObjectId.isValid(weightCategoryId)) throw Error('El ID de la categoria de peso no es valido');
		//If weight is not valid
		if(minWeight >= maxWeight) throw Error('El peso minimo no puede ser mayor al maximo');
		//If exist weight category already
		const exist = await WeightCategory.existWeightCategory(data);
		logger.info(!exist);
		if(exist && exist._id != weightCategoryId) throw Error('Ya existe una categoria de peso con alguna de esas caracteriticas [nombre, minWeight, maxWeight]');
		//If category not exist
		const result = await WeightCategory.findOneAndUpdate({ _id: weightCategoryId }, data, { new: true });
		if(!result) throw Error('No existe una categoria asociada a ese id');
		res.send({ WeightCategory: result });
	}),

	//delete a category by id
	deleteWeightCategory: capture(async (req, res)=>{
		const weightCategoryId = req.query.weightCategoryId as string;

		//If id is not valid
		if(!mongoose.Types.ObjectId.isValid(weightCategoryId)) throw Error('El ID de la categoria de peso no es valido');
		//If weigth category exists
		const result = await WeightCategory.findById(weightCategoryId);
		if(!result) throw Error('No existe una categoria con ese Id');
		//Delete category
		await WeightCategory.deleteOne(result);
		await User.deleteWeightCategoryFromUser(result._id);
		res.send({ Category: 'Categoria eliminada' });
	}),
};