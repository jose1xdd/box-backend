import mongoose from 'mongoose';
import { Iindex, Iseccion } from '../../../types/globals';
import { indexModel } from '../static';

const seccionShema = new mongoose.Schema<Iseccion>({
	name: String,
	description: String,
	photo: String
});

const indexSchema = new mongoose.Schema<Iindex>({
	mision: String,
	vision: String,
	logo: String,
	section: {
		type: [seccionShema],
		default: []
	}
}, { versionKey: false });

indexSchema.loadClass(indexModel);
export default indexSchema;