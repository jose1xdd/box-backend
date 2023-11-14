import { Model } from 'mongoose';
import { IWebTokenDocument } from '../../../types/webToken';

export class webTokenModel extends Model<IWebTokenDocument> {
	static async getIdUser(token: string){
		const result = await this.findOne({ token: token });
		return result.userId;
	}
}