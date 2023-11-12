import mongoose from 'mongoose';
import { IcriterioTestDocument } from '../../types/criterioTest';

const criterioTestSchema = new mongoose.Schema<IcriterioTestDocument>({
	name: {
		type: String,
		required: true,
	}
});

const criterioTestModel = mongoose.model('criterioTest', criterioTestSchema);
export default criterioTestModel;