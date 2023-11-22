import mongoose from 'mongoose';
import { IcriterioTestDocument, IcriterioTestuser } from '../../../types/criterioTest';
import { criterioTestModel } from '../static/criterioTest';

export const criterioSchemaTestUser = new mongoose.Schema<IcriterioTestuser>({
	name: {
		type: String,
		required: true,
	},
	repeats: {
		type: Number,
		required: true,
	}
}, { versionKey: false });

const criterioTestSchema = new mongoose.Schema<IcriterioTestDocument>({
	name: {
		type: String,
		required: true,
	},
}, { versionKey: false });

criterioTestSchema.loadClass(criterioTestModel);
export default criterioTestSchema;
