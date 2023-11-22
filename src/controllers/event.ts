
import mongoose from 'mongoose';
import { Event } from '../database/models/event';
import { capture } from '../middlewares/errorhandler';
import { User } from '../database/models/user';
import { DEFAUL_LIMIT } from '../codeUtils/globals';
export const eventController = {

	//create a meet event
	createEventMeet: capture(async (req, res)=>{
		const data = req.body;
		data.type = 'Reunion';
		const startsAt = data.startsAt;
		const endsAt = data.endsAt;
		const trainerId = data.trainer as string;
		if(startsAt > endsAt) throw Error('La fecha de inicio no puede ser mayor a la final');
		if(!mongoose.Types.ObjectId.isValid(trainerId)) throw Error('El ID del entrenador no es valido');
		const participants = data.participants;
		for (const participant of participants) {
			if(!mongoose.Types.ObjectId.isValid(participant)) throw Error('El ID del un participante no es valido');
		}
		const exist = await Event.getEventByDate(startsAt, endsAt);
		if(exist) throw Error('Ya exsite un evento en esa fecha');
		const result = await Event.create(data);
		res.send({ role: result });
	}),

	//create a meet event
	createEventBattle: capture(async (req, res)=>{
		const data = req.body;
		data.type = 'Combate';
		const category = data.weigthCategory;
		const startsAt = data.startsAt;
		const endsAt = data.endsAt;
		const trainerId = data.trainer as string;
		if(startsAt > endsAt) throw Error('La fecha de inicio no puede ser mayor a la final');
		if(!mongoose.Types.ObjectId.isValid(trainerId)) throw Error('El ID del entrenador no es valido');
		if(!mongoose.Types.ObjectId.isValid(category)) throw Error('El ID de la categoria no es valido no es valido');
		const battles = data.combats;
		for (const battle of battles) {
			const boxer1 = battle.boxer1;
			const boxer2 = battle.boxer2;
			if(!mongoose.Types.ObjectId.isValid(boxer1)) throw Error('El ID del un participante no es valido');
			if(!mongoose.Types.ObjectId.isValid(boxer2)) throw Error('El ID del un participante no es valido');
			if(boxer1 == boxer2) throw Error('No puede existir una pelea entre una misma persona (ID repetido)');
		}
		const exist = await Event.getEventByDate(startsAt, endsAt);
		if(exist) throw Error('Ya exsite un evento en esa fecha');
		const result = await Event.create(data);
		res.send({ role: result });
	}),

	//get events
	getEvent: capture(async (req, res)=>{
		let limit = DEFAUL_LIMIT;
		if(req.query.limit) limit = parseInt(req.query.limit as string);
		const result = await Event.getEvents(limit);
		for (const event of result) {
			if(event.type == 'Reunion'){
				event.participants = await User.getUsersFromList(event.participants);
			}else{
				for(const battle of event.combats) {
					const boxer1 = battle.boxer1;
					const boxer2 = battle.boxer2;
					battle.boxer1 = await User.getUserById(boxer1);
					battle.boxer2 = await User.getUserById(boxer2);
				}
			}
		}
		res.send({ eventos: result });
	}),

	//get event by Id
	getEventById: capture(async (req, res)=>{
		const eventId = req.query.eventId;
		const result = await Event.findById(eventId);
		if(!result) throw Error('No existe ese evento');
		const type = result.type;
		result.trainer = await User.getUserById(result.trainer);
		if(type == 'Reunion'){
			result.participants = await User.getUsersFromList(result.participants);
		}else{
			for(const battle of result.combats) {
				const boxer1 = battle.boxer1;
				const boxer2 = battle.boxer2;
				battle.boxer1 = await User.getUserById(boxer1);
				battle.boxer2 = await User.getUserById(boxer2);
			}
		}
		res.send({ evento: result });
	}),
};