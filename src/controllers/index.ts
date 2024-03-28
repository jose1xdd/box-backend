
import mongoose from 'mongoose';
import { Index } from '../database/models';
import { capture } from '../middlewares/errorhandler';
export const indexPagController = {

	//update mision vision index
	updateIndex: capture(async (req, res)=>{
		const data = req.body;
		const index = await Index.findOne();
		let result;

		if(index) {
			result = await Index.findByIdAndUpdate(index['_id'], data, { new: true });
		}else {
			result = await Index.create(data);
		}
		res.send({ index: result });
	}),

	//add section
	addSection: capture(async (req, res)=>{
		const data = req.body;
		const index = await Index.findOne();
		let result;
		if(index) {
			if(index.section){
				const { section } = index;
				let exist = false;
				section.forEach((i)=>{
					const iName = i.name;
					if(!exist) exist = iName == data.name;
				});
				if(exist) throw Error('Ya existe una seccion con ese nombre');
				result = await Index.addSection(data);
			}
		}else {
			result = await Index.create({ section: data });
		}
		res.send({ index: result });
	}),

	//delete section
	deleteSection: capture(async (req, res)=>{
		const sectionId = req.query.sectionId as string;
		if(!mongoose.Types.ObjectId.isValid(sectionId)) throw Error('El ID de la seccion no es valido');
		const index = await Index.findOne();
		const result = await Index.deleteSection(sectionId);
		if(index.section.length === result.section.length) throw Error('El ID de esa seccion no se encuentra registrado');
		res.send({ index: result });
	}),

	//get the index info
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