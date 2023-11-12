import mongoose from 'mongoose';
import { IclubDocument } from '../../../types/club';
import { clubModel } from '../static/club';

const clubSchema = new mongoose.Schema<IclubDocument>({
	name: String,
	description: String,
	photo: String,
});

clubSchema.loadClass(clubModel);
export default clubSchema;