import mongoose from 'mongoose';
import { IclubDocument } from '../../../types/club';
import { clubModel } from '../static/club';

const clubSchema = new mongoose.Schema<IclubDocument>({
	name: String,
	description: String,
	photo: {
		type: String,
		default: null
	},
	members: {
		type: [],
		default: []
	}
});

clubSchema.loadClass(clubModel);
export default clubSchema;