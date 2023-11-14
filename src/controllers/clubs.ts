import { capture } from '../middlewares/errorhandler';
import { Club } from '../database/models/club';
import mongoose from 'mongoose';

export const clubsController = {
	create: capture(async (req, res)=>{
		const data = req.body;
		//If club its repeat
		const exist = await Club.getClubByName(data.name);
		if(exist) throw Error('Ya hay un club registrado con ese nombre');
		//Create the club
		const club = await Club.create(data);
		res.send({ club: club });
	}),

	updateClub: capture(async (req, res)=>{
		const data = req.body;
		const clubId = req.query.clubId as string;
		//If id is not valid
		if(!mongoose.Types.ObjectId.isValid(clubId)) throw Error('El ID del club no es valido');
		//If club its repeat
		if(data.name){
			const exist = await Club.getClubByName(data.name);
			if(exist) throw Error('Ya hay un club registrado con ese nombre');
		}
		//Update the club
		const club = await Club.updateClub(clubId, data);
		if(!club) throw Error('No se encuentra un club correspondiente a ese Id');
		res.send({ club: club });
	}),

	getClub: capture(async (req, res)=>{
		const clubId = req.query.clubId as string;
		//If id is not valid
		if(!mongoose.Types.ObjectId.isValid(clubId)) throw Error('El ID del club no es valido');
		const club = Club.getClubById(clubId);
		//If club does not exist
		if(!mongoose.Types.ObjectId.isValid(clubId)) throw Error('No se encuentra registrado un club con ese ID');
		res.send({ club: club });
	}),

	//get club List
	getClubList: capture(async (req, res)=>{
		const limit = parseInt(req.query.limit as string);
		const clubs = await Club.getClubList(limit);
		res.send({ clubs: clubs });
	})
};