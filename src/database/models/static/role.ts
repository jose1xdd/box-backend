import mongoose, { Model } from 'mongoose'; '../../../types/weightCategory';

export class roleModel extends Model<Irole> {
	static async getRoleByName(roleName: string){
		return this.findOne({ name: roleName });
	}
	static async getRoleById(id:string){
		const query = await this.findOne({ _id: id });
		return query;
	}
	static async deleteRolById(id:string){
		return this.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
	}
}