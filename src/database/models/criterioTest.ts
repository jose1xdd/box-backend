import mongoose from 'mongoose';
import { IcriterioTestDocument } from '../../types/criterioTest';

const criterioTestSchema = new mongoose.Schema<IcriterioTestDocument>({});

const criterioTestModel = mongoose.model('criterioTest', criterioTestSchema);
export default criterioTestModel;