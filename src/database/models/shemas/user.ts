import mongoose from 'mongoose';
import { IUserDocument } from '../../../types/user';
import { UserDefaultRol } from '../../../codeUtils/globals';
import { physicalTestSchema } from '../../../controllers/global';
import { userModel } from '../static/user';

const userSchema = new mongoose.Schema<IUserDocument>({
	name: String,
	lastName: String,
	birthDate: Date,
	cedula: String,
	email: String,
	weight: Number,
	phone: String,
	address: String,
	club: {
		type: mongoose.Types.ObjectId,
		default(this: IUserDocument) {
			if (this.role !== 'Admin') return null;
			return undefined;
		},
	},
	password: String,
	role: {
		type: String,
		default: UserDefaultRol
	},
	photo: String,
	weightCategory: {
		type: String,
		default(this: IUserDocument) {
			if (this.role === 'Deportista') return null;
			return undefined;
		},
	},
	physicalTest: {
		type: [physicalTestSchema],
		default(this: IUserDocument) {
			if (this.role === 'Deportista') return [];
			return undefined;
		},
	}
});
userSchema.loadClass(userModel);
export default userSchema;