import mongoose from 'mongoose';
import role from '../models/shemas/role';
import { roleModel } from './static/role';

export const Role = mongoose.model<Irole, typeof roleModel>('role', role);