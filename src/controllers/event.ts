
import mongoose from 'mongoose';
import { Event } from '../database/models/event';
import { capture } from '../middlewares/errorhandler';
import { User } from '../database/models/user';
import { DEFAUL_LIMIT } from '../codeUtils/globals';
import { logger } from '../logger/winston';
export const eventController = {

	//create a meet event
	createEventMeet: capture(async (req, res)=>{
		const data = req.body;
		data.type = 'Reunion';
		//setear la fecha
		data.startsAt += ':00.000Z';
		data.endsAt += ':00.000Z';
		const startsAt = new Date (data.date as string + 'T' + data.startsAt as string);
		const endsAt = new Date (data.date + 'T' + data.endsAt);
		const trainerId = data.trainer as string;
		//comprobar las fechas
		if(startsAt > endsAt) throw Error('La fecha de inicio no puede ser mayor a la final');
		//comprobar entrenador
		if(!mongoose.Types.ObjectId.isValid(trainerId)) throw Error('El ID del entrenador no es valido');
		const { participants } = data;
		const users:string[] = [];
		for (const participant of participants) {
			users.push((await User.getUserByEmail(participant))._id);
		}
		data.participants = users;
		//comprobar si existe otro evento
		const exist = await Event.getEventByDate(startsAt, endsAt);
		if(exist) throw Error('Ya exsite un evento en esa fecha');
		//setear la informacion
		data.startsAt = startsAt;
		data.endsAt = endsAt;
		const result = await Event.create(data);
		res.send({ event: result });
	}),

	//create a battle event
	createEventBattle: capture(async (req, res)=>{
		const data = req.body;
		data.type = 'Combate';
		//setear la fecha
		data.startsAt += ':00.000Z';
		data.endsAt += ':00.000Z';
		const startsAt = new Date (data.date as string + 'T' + data.startsAt as string);
		const endsAt = new Date (data.date + 'T' + data.endsAt);
		const trainerId = data.trainer as string;
		//comprobar las fechas
		if(startsAt > endsAt) throw Error('La fecha de inicio no puede ser mayor a la final');
		//comprobar entrenador
		if(!mongoose.Types.ObjectId.isValid(trainerId)) throw Error('El ID del entrenador no es valido');
		const battles = data.combats;
		for (const battle of battles) {
			const { boxer1 } = battle;
			const { boxer2 } = battle;
			//comprobar deportistas
			if(!mongoose.Types.ObjectId.isValid(boxer1)) throw Error('El ID del un participante no es valido');
			if(!mongoose.Types.ObjectId.isValid(boxer2)) throw Error('El ID del un participante no es valido');
			if(boxer1 == boxer2) throw Error('No puede existir una pelea entre una misma persona (ID repetido)');
		}
		//comprobar existe evento
		const exist = await Event.getEventByDate(startsAt, endsAt);
		if(exist) throw Error('Ya exsite un evento en esa fecha');
		//setear la informacion
		data.startsAt = startsAt;
		data.endsAt = endsAt;
		const result = await Event.create(data);
		res.send({ role: result });
	}),

	//get events
	getEvent: capture(async (req, res)=>{
		let limit = DEFAUL_LIMIT;
		const data = req.query;
		let startsAt;
		let endsAt;
		if(data.startsAt) startsAt = new Date(data.startsAt as string + 'T00:00:00.000Z');
		if(data.endsAt) endsAt = new Date(data.endsAt as string + 'T00:00:00.000Z');
		if(typeof startsAt != typeof endsAt) throw Error('Se han enviado fechas de busqueda imcompletas');
		if(startsAt && endsAt && (startsAt > endsAt)) throw Error('No se admite startAt despues de endAt');
		if(data.limit) limit = parseInt(req.query.limit as string);
		const result = await Event.getEvents(limit, startsAt, endsAt);
		for (const event of result) {
			if(event.type == 'Reunion'){
				event.participants = await User.getUsersFromList(event.participants);
			}else{
				for(const battle of event.combats) {
					const { boxer1 } = battle;
					const { boxer2 } = battle;
					battle.boxer1 = await User.getUserById(boxer1);
					battle.boxer2 = await User.getUserById(boxer2);
				}
			}
		}
		res.send({ eventos: result });
	}),

	//get event by Id
	getEventById: capture(async (req, res)=>{
		const { eventId } = req.query;
		const result = await Event.findById(eventId);
		if(!result) throw Error('No existe ese evento');
		const { type } = result;
		result.trainer = await User.getUserById(result.trainer);
		if(type == 'Reunion'){
			result.participants = await User.getUsersFromList(result.participants);
		}else{
			for(const battle of result.combats) {
				const { boxer1 } = battle;
				const { boxer2 } = battle;
				battle.boxer1 = await User.getUserById(boxer1);
				battle.boxer2 = await User.getUserById(boxer2);
			}
		}
		res.send({ evento: result });
	}),

	//set event result
	setEventResult: capture(async (req, res)=>{
		const { eventId, combats } = req.body;
		const results = new Map<string, any>();
		//mapping the results
		for(const result of combats){
			logger.warn(result.battleId as string);
			results.set(result.battleId as string, result);
		}
		//if event exist
		if(!mongoose.Types.ObjectId.isValid(eventId)) throw Error('El ID del evento no es valido');
		const event = await Event.findById(eventId);
		if(!event) throw Error('Ese evento no se encuentra registrado');
		if(event.type == 'Reunion') throw Error('No se puede calificar un evento de tipo reunion');
		//setear results
		for(const battle of event.combats) {
			const result = results.get(battle._id.toString());
			if(!result) throw Error('No se ha enviado el resultado para una batalla');
			if(result.status === 'winner'){
				const userId = result.winner;
				if(!mongoose.Types.ObjectId.isValid(userId)) throw Error('El ID de uno de los usuarios no es valido');
				const user = await User.findById(userId);
				if(!user) throw Error('En los resultados se ha enviado un deportista que no esta registrado en el sistema');
				if(user.role != 'Deportista') throw Error('Una pelea no puede ser ganada por un usuario que no sea deportista');
				battle.status = 'Finalizado';
				battle.winner = userId;
				//Actualizar estadisticas de deportista
				user.ranking.win++;
				if(userId == battle.boxer1){
					const boxer2 = await User.getUserById(battle.boxer2);
					boxer2.ranking.lose++;
					await User.updateUser(battle.boxer2, boxer2);
				}else if(userId == battle.boxer2){
					const boxer2 = await User.getUserById(battle.boxer1);
					boxer2.ranking.lose++;
					await User.updateUser(battle.boxer1, boxer2);
				}else {
					throw Error('Ese deportista no esta inscrito en esa pelea');
				}
				await User.updateUser(userId, user);
			}else{
				const user1 = battle.boxer1;
				const user2 = battle.boxer2;
				const boxer1 = await User.findById(user1);
				const boxer2 = await User.findById(user2);
				boxer1.ranking.draw++;
				boxer2.ranking.draw++;
				await User.updateUser(boxer1._id, boxer1);
				await User.updateUser(boxer2._id, boxer2);
			}
		}
		const result = await Event.findByIdAndUpdate(eventId, event);
		res.send({ event: result });
	}),
};