import mongoose from 'mongoose';
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
}, { versionKey: false });

clubSchema.loadClass(clubModel);
export default clubSchema;