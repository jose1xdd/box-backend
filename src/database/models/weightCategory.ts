import mongoose from 'mongoose';
import weigthCategory from '../models/shemas/weightCategory';
import { IweightCategoryDocument } from '../../types/weightCategory';
import { weightCategoryModel } from './static/weightCategory';

export const weightCategory = mongoose.model<IweightCategoryDocument, typeof weightCategoryModel>('weihgthCategorys', weigthCategory);