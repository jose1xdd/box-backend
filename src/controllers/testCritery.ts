import mongoose from 'mongoose';
import { CriterioTest } from '../database/models/criterioTest';
import { capture } from '../middlewares/errorhandler';
export const testCriteryController = {

	//create a test critery
	createCritery: capture(async (req, res)=>{
		const data = req.body;
		const name = (data.name as string).toLowerCase();
		const exist = await CriterioTest.getCriteryByName(name);
		if(exist) throw Error('Ya existe un criterio con ese nombre');
		data.name = name;
		const result = await CriterioTest.create(data);
		res.send({ result: result });
	}),

	//delete a test critery
	deleteCritery: capture(async (req, res)=>{
		const criteryId = req.query.criteryId as string;
		if(!mongoose.Types.ObjectId.isValid(criteryId)) throw Error('El ID del criterio no es valido');
		const critery = await CriterioTest.findById(criteryId);
		if(!critery) throw Error('No existe un criterio asociado a ese ID');
		await CriterioTest.deleteOne(critery);
		res.send({ critery: 'Criterio eliminado' });
	}),

	//get critery test list
	getCriteryList: capture(async (req, res)=>{
		const result = await CriterioTest.getCriteryList();
		res.send({ critery: result });
	})
};