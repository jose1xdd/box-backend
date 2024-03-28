import mongoose from 'mongoose';
import codeModel from './static/code';
import codeSchema from './shemas/code';

export const Code = mongoose.model<IcodeDocument, typeof codeModel>('code', codeSchema);