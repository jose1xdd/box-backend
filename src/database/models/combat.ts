import mongoose from 'mongoose';
import { IcombatDocument } from '../../types/combat';
import weightCategoryModel from './weightCategory';

const combatSchema = new mongoose.Schema<IcombatDocument>({
	boxer1: mongoose.Types.ObjectId,
	boxer2: mongoose.Types.ObjectId,
	status: String,
	weigthCategory: weightCategoryModel
});
const CombatModel = mongoose.model('Combats', combatSchema);
export default CombatModel;