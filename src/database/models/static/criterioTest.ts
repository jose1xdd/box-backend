import { Model } from 'mongoose'; '../../../types/weightCategory';
import { IcriterioTestDocument } from '../../../types/criterioTest';

export class criterioTestModel extends Model<IcriterioTestDocument> {
	static getCriteryByName(criteyName: string){
		return this.findOne({ name: criteyName });
	}

	static getCriteryList(){
		return this.find({}, { __v: 0 });
	}
}