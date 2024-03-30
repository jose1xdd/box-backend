import { DateTime } from 'luxon';
import { Model } from 'mongoose';

export class webTokenModel extends Model<IWebTokenDocument> {
	static async getIdUser(token: string){
		const result = await this.findOne({ token });
		return result.userId;
	}
	static async update(token:IWebTokenDocument){
		token.ttl = DateTime.now().plus({ hour: 1 }).toJSDate();
		await this.updateOne(token);
	}
}