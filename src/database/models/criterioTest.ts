import mongoose from 'mongoose';
import criterioTest from '../models/shemas/criterioTest';
import { criterioTestModel } from './static/criterioTest';

export const CriterioTest = mongoose.model<IcriterioTestDocument, typeof criterioTestModel>('criterioTest', criterioTest);