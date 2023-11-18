import mongoose from 'mongoose';
import index from '../models/shemas/index';
import { Iindex } from '../../types/globals';
import { indexModel } from './static';

export const Index = mongoose.model<Iindex, typeof indexModel>('index', index);