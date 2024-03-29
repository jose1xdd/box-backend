import { Model } from 'mongoose';

export default class codeModel extends Model<Icode>{
	static async createCode(userId:string, code:string){
		await this.create({ userId, code });
	}
	static async fetchCodeByCode(userId:string, code:string){
		const result = await this.findOne({ userId, code });
		return result;
	}
	static async fetchCodeByuserId(userId:string){
		const result = await this.findOne({ userId });
		return result;
	}
	static async deleteCodeByCode(userId:string, code:string){
		await this.deleteOne({ userId, code });
	}
}