import mongoose from 'mongoose';
import { IWebTokenDocument } from '../../../types/webToken';
import { webTokenModel } from '../static/webToken';

const webTokenShema = new mongoose.Schema<IWebTokenDocument>({
	userId: mongoose.Types.ObjectId,
	ttl: {
		type: Date,
		require: true
	},
	token: String
});

webTokenShema.loadClass(webTokenModel);
export default webTokenShema;

