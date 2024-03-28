import { Model } from 'mongoose';

export default class codeModel extends Model<Icode>{
	static async createCode(userId:string, code:string){
		await this.create({ userId, code });
	}
	static async fetchCodeByEmail(userId:string, code:string){
		const result = await this.findOne({ userId, code });
		return result;
	}
}