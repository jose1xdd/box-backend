import mongoose from 'mongoose';
import user from '../models/shemas/user';
import { userModel } from './static/user';

export const DisableUser = mongoose.model<IUserDocument, typeof userModel>('disableUsers', user);