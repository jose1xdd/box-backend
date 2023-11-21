
import mongoose from 'mongoose';
import { Event } from '../database/models/event';
import { capture } from '../middlewares/errorhandler';
export const eventController = {

	//create a generic role
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
};