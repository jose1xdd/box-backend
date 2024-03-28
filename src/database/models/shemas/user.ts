import mongoose from 'mongoose';
import { UserDefaultRol } from '../../../codeUtils/globals';
import { physicalTestSchema } from '../../../controllers/global';
import { userModel } from '../static/user';

const rankingSchema = new mongoose.Schema<Iranking>({
	win: {
		type: Number,
		default: 0
	},
	lose: {
		type: Number,
		default: 0
	},
	draw: {
		type: Number,
		default: 0
	}
}, { _id: false });

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
			if (this.role === 'Deportista') return null;
			return undefined;
		},
	},
	password: String,
	role: {
		type: mongoose.Schema.Types.Mixed,
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
	ranking: {
		type: rankingSchema,
		default(this: IUserDocument) {
			if (this.role === 'Deportista') return { win: 0, lose: 0, draw: 0 };
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
}, { versionKey: false });
userSchema.loadClass(userModel);
export default userSchema;