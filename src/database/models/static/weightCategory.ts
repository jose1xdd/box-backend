import { Model } from 'mongoose';

export class weightCategoryModel extends Model<IweightCategoryDocument> {
	static existWeightCategory(data: IweightCategoryDocument){
		const { name } = data;
		const { minWeight } = data;
		const { maxWeight } = data;
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

	static getWeightCategoriesByWeight(data){
		const { minWeight } = data;
		const { maxWeight } = data;
		let constrains = {};
		if(minWeight) {
			constrains = { $and: [
				{ 'minWeight': { $gte: minWeight } },
				{ 'maxWeight': { $lte: maxWeight } }
			] };
		}
		return this.find(constrains);
	}
}