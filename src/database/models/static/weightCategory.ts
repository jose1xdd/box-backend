import { Model } from 'mongoose';
import { IweightCategoryDocument } from '../../../types/weightCategory';

export class weightCategoryModel extends Model<IweightCategoryDocument> {
	static existWeightCategory(data: IweightCategoryDocument){
		const name = data.name;
		const minWeight = data.minWeight;
		const maxWeight = data.maxWeight;
		const constrains = {
			$or: [
				{ 'name': name },
				{
					$and: [
						{ 'minWeight': { $lte: maxWeight } },
						{ 'maxWeight': { $gte: minWeight } }
					]
				}
			]
		};
		return this.findOne(constrains);
	}
}