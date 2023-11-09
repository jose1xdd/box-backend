import mongoose from 'mongoose';
import { IUserDocument } from '../../types/user';
import { UserDefaultRol } from '../../codeUtils/globals';
import { physicalTestSchema } from '../../controllers/global';

const userSchema = new mongoose.Schema<IUserDocument>({
	name: String,
	lastName: String,
	birthDate: Date,
	cedula: String,
	email: String,
	weight: Number,
	phone: String,
	address: String,
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
const userModel = mongoose.model('Users', userSchema);
export default userModel;