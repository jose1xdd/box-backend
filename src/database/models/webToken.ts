import mongoose from 'mongoose';
import { IWebTokenDocument } from '../../types/webToken';

const webTokenShema = new mongoose.Schema<IWebTokenDocument>({
	userId: mongoose.Types.ObjectId,
	ttl: {
		type: Date,
		require: true
	},
	token: String
});

const webTokenModel = mongoose.model('webToken', webTokenShema);
export default webTokenModel;
