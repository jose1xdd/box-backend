import mongoose from 'mongoose';
import club from '../models/shemas/club';
import { IclubDocument } from '../../types/club';
import { clubModel } from './static/club';

export const Club = mongoose.model<IclubDocument, typeof clubModel>('clubs', club);