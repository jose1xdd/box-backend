import { Model } from 'mongoose'; '../../../types/weightCategory';
import { DEFAUL_LIMIT } from '../../../codeUtils/globals';
export class eventModel extends Model<IeventDocument> {
	static getEventByDate(startsAt: Date, endsAt:Date){
		return this.findOne({
			$or: [
				{
					startsAt: { $gte: startsAt, $lte: endsAt }
				},
				{
					endsAt: { $gte: startsAt, $lte: endsAt }
				},
				{
					$and: [
						{ startsAt: { $lte: startsAt } },
						{ endsAt: { $gte: endsAt } }
					]
				}
			]
		});
	}

	static getEvents(limit: number = DEFAUL_LIMIT, startsAt: Date, endsAt: Date){
		let constrains;
		if(startsAt){
			constrains = {
				$or: [
					{
						startsAt: { $gte: startsAt, $lte: endsAt }
					}
				]
			};
		}else{
			constrains = {};
		}
		return this.find(constrains).limit(limit);
	}
}