import mongoose from 'mongoose';
import event from '../models/shemas/event';
import { eventModel } from './static/event';

export const Event = mongoose.model<IeventDocument, typeof eventModel>('events', event);