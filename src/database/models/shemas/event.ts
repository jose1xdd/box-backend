import mongoose from 'mongoose';
import { IeventDocument } from '../../../types/event';
import CombatModel from './combat';
import { eventModel } from '../static/event';

const eventSchema = new mongoose.Schema<IeventDocument>({
	type: String,
	trainer: mongoose.Types.ObjectId,
	name: String,
	description: String,
	combats: {
		type: [CombatModel],
		default(this: IeventDocument) {
			if (this.type === 'Combate') return [];
			return undefined;
		},
	},
	startsAt: Date,
	endsAt: Date,
	participants: {
		type: mongoose.Schema.Types.Mixed,
		default(this: IeventDocument) {
			if (this.type === 'Reunion') return [];
			return undefined;
		},
	}
});

eventSchema.loadClass(eventModel);
export default eventSchema;
