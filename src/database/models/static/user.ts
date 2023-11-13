import { Model } from 'mongoose';
import { IUserDocument } from '../../../types/user';

export class userModel extends Model<IUserDocument> {
	static updateUser(userId: string, data: IUserDocument){
		return this.findByIdAndUpdate(userId, data, { projection: { password: 0, role: 0, __v: 0 }, new: true });
	}

	static getUserById(userId: string){
		return this.findById(userId, { password: 0, __v: 0 });
	}
}