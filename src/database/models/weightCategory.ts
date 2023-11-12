import mongoose from 'mongoose';
import { IweightCategoryDocument } from '../../types/weightCategory';

const weightCategorySchema = new mongoose.Schema<IweightCategoryDocument>({
	name: String,
	maxWeight: Number,
	minWeight: Number
});
const weightCategoryModel = mongoose.model('Users', weightCategorySchema);
export default weightCategoryModel;