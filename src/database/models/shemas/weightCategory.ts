import mongoose from 'mongoose';
import { IweightCategoryDocument } from '../../../types/weightCategory';
import { weightCategoryModel } from '../static/weightCategory';

const weightCategorySchema = new mongoose.Schema<IweightCategoryDocument>({
	name: String,
	maxWeight: Number,
	minWeight: Number
});

weightCategorySchema.loadClass(weightCategoryModel);
export default weightCategorySchema;