import { Model } from 'mongoose';
import { IUserDocument } from '../../../types/user';

export class userModel extends Model<IUserDocument> {
	static fetchUserBuId(userId: string){
		return this.findById(userId);
	}

}