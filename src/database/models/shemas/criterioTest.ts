import mongoose from 'mongoose';
import { IcriterioTestDocument } from '../../../types/criterioTest';
import { criterioTestModel } from '../static/criterioTest';

const criterioTestSchema = new mongoose.Schema<IcriterioTestDocument>({
	name: {
		type: String,
		required: true,
	}
});

criterioTestSchema.loadClass(criterioTestModel);
export default criterioTestSchema;
