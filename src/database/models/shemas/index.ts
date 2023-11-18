import mongoose from 'mongoose';
import { Iindex } from '../../../types/globals';
import { eventModel } from '../static/event';
const indexSchema = new mongoose.Schema<Iindex>({
	mision: String,
	vision: String,
	logo: String,
	seccion: {
		default: []
	}
});

indexSchema.loadClass(eventModel);
export default indexSchema;