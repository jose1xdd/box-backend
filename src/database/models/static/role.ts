import { Model } from 'mongoose'; '../../../types/weightCategory';
import { Irole } from '../../../types/user';

export class roleModel extends Model<Irole> {
	static getRoleByName(roleName: string){
		return this.findOne({ name: roleName });
	}
}