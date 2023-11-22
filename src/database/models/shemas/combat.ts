import mongoose from 'mongoose';
import { IcombatDocument } from '../../../types/combat';
import { combatModel } from '../static/combat';

const combatSchema = new mongoose.Schema<IcombatDocument>({
	boxer1: mongoose.Schema.Types.Mixed,
	boxer2: mongoose.Schema.Types.Mixed,
	winner: {
		type: mongoose.Schema.Types.Mixed,
		default: null
	},
	status: {
		type: String,
		default: 'En espera de resultados'
	},
	weigthCategory: mongoose.Schema.Types.Mixed
}, { versionKey: false });

combatSchema.loadClass(combatModel);
export default combatSchema;
