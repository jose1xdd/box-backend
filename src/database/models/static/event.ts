import { Model } from 'mongoose'; '../../../types/weightCategory';
import { IeventDocument } from '../../../types/event';
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

	static getEvents(limit: number = DEFAUL_LIMIT){
		return this.find().limit(limit);
	}
}