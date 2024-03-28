import mongoose from 'mongoose';
import { webTokenModel } from '../static/webToken';

const webTokenShema = new mongoose.Schema<IWebTokenDocument>({
	userId: mongoose.Types.ObjectId,
	ttl: {
		type: Date,
		require: true,
		expires: '1m'
	},
	token: String
}, { versionKey: false });

webTokenShema.loadClass(webTokenModel);
export default webTokenShema;

