import { DateTime } from 'luxon';
import { Model } from 'mongoose';

export class webTokenModel extends Model<IWebTokenDocument> {
	static async getIdUser(token: string){
		const result = await this.findOne({ token });
		return result.userId;
	}
	static async update(token:IWebTokenDocument){
		const ttl = DateTime.now().plus({ hours: 1 }).toJSDate();
		await this.updateOne({ _id: token._id }, { ttl });
	}
}