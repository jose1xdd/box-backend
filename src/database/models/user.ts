import mongoose from 'mongoose';
import { IUserDocument } from '../../types/user';

const userSchema = new mongoose.Schema<IUserDocument>({});

export default userSchema;