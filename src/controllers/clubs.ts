import { capture } from '../middlewares/errorhandler';
import { Club } from '../database/models/club';
import mongoose from 'mongoose';
import { User } from '../database/models/user';

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

	//update a info club
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

	deleteClub: capture(async (req, res)=>{
		const clubId = req.query.clubId as string;
		//If id is not valid
		if(!mongoose.Types.ObjectId.isValid(clubId)) throw Error('El ID del club no es valido');
		//If club not exist
		const club = await Club.getClubById(clubId);
		if(!club) throw Error('El club no se encuentra registrado');
		//delete club
		await Club.deleteOne();
		await User.deleteClubFromUser(club._id);
		res.send({ club: 'Club eliminado' });
	}),

	//get a club by Id
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