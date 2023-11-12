import mongoose from 'mongoose';
import { IclubDocument } from '../../types/club';

const clubSchema = new mongoose.Schema<IclubDocument>({
	name: String,
	description: String,
	photo: String,
});

const clubModel = mongoose.model('Clubs', clubSchema);
export default clubModel;