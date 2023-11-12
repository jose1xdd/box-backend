import mongoose from 'mongoose';
import combat from '../models/shemas/combat';
import { IcombatDocument } from '../../types/combat';
import { combatModel } from './static/combat';

export const Combat = mongoose.model<IcombatDocument, typeof combatModel>('combats', combat);