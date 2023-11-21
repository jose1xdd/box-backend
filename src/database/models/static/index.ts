import { Model } from 'mongoose'; '../../../types/weightCategory';
import { Iindex, Iseccion } from '../../../types/globals';

export class indexModel extends Model<Iindex> {
	static async addSection(data: Iseccion){
		const result = this.findOneAndUpdate({}, { $push: { section: data } }, { new: true });
		return result;
	}

	static async deleteSection(sectionId: string){
		const result = this.findOneAndUpdate({}, { $pull: { section: { _id: sectionId } } }, { new: true });
		return result;
	}
}