import mongoose from 'mongoose';
import { Irole } from '../../../types/user';
import { roleModel } from '../static/role';

const roleSchema = new mongoose.Schema<Irole>({
	name: String,
	permissions: String,
}, { versionKey: false });

roleSchema.loadClass(roleModel);
export default roleSchema;
