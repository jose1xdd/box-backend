import mongoose from 'mongoose';
import { IcombatDocument } from '../../../types/combat';
import weightCategoryModel from './weightCategory';
import { combatModel } from '../static/combat';

const combatSchema = new mongoose.Schema<IcombatDocument>({
	boxer1: mongoose.Types.ObjectId,
	boxer2: mongoose.Types.ObjectId,
	status: String,
	weigthCategory: weightCategoryModel
});

combatSchema.loadClass(combatModel);
export default combatSchema;
