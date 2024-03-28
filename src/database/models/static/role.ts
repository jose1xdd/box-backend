import { Model } from 'mongoose'; '../../../types/weightCategory';

export class roleModel extends Model<Irole> {
	static getRoleByName(roleName: string){
		return this.findOne({ name: roleName });
	}
}