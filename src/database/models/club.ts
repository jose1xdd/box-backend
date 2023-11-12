import mongoose from 'mongoose';
import { IclubDocument } from '../../types/club';

const clubSchema = new mongoose.Schema<IclubDocument>({
	name: String,
	description: String,
	photo: String,
});

const clubModel = mongoose.model('Users', clubSchema);
export default clubModel;