import mongoose, { Model } from 'mongoose';
import { IUserDocument } from '../../../types/user';
import { DEFAUL_LIMIT } from '../../../codeUtils/globals';

export class userModel extends Model<IUserDocument> {
	static updateUser(userId: string, data: IUserDocument){
		return this.findByIdAndUpdate(userId, data, { projection: { password: 0, role: 0, __v: 0 }, new: true });
	}

	static getUserById(userId: string){
		return this.findById(userId, { password: 0, __v: 0 });
	}

	static getUserListByRole(limit: number = DEFAUL_LIMIT, role: string){
		let roles = {};
		const constrains = {
			password: 0,
			__v: 0
		};
		if(role) roles = { role: role };
		return this.find(roles, constrains).limit(limit);
	}

	static deleteClubFromUser(clubId: mongoose.Types.ObjectId){
		return this.updateMany({ club: clubId }, { $set: { club: null } });
	}

	static deleteWeightCategoryFromUser(categoryId: mongoose.Types.ObjectId){
		return this.updateMany({ weightCategory: categoryId }, { $set: { weightCategory: null } });
	}
}