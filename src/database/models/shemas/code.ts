import mongoose from 'mongoose';
import codeModel from '../static/code';

const codeSchema = new mongoose.Schema<IcodeDocument>({
	userId: mongoose.Types.ObjectId,
	code: String
});
codeSchema.loadClass(codeModel);
export default codeSchema;