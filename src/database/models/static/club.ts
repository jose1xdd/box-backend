import { Model } from 'mongoose'; '../../../types/weightCategory';
import { IclubDocument } from '../../../types/club';

export class clubModel extends Model<IclubDocument> {
	static getClubByName(clubName: string){
		return this.findOne({ name: clubName });
	}

	static updateClub(clubId: string, data: IclubDocument){
		return this.findOneAndUpdate({ _id: clubId }, data, { projection: { __v: 0 }, new: true });
	}

	static getClubById(clubId: string){
		return this.findOne({ _id: clubId }, { projection: { __v: 0 }, new: true });
	}

	static getClubList(limit: number){
		const constrains = {
			__v: 0
		};
		return this.find({}, constrains).limit(limit);
	}
}