import mongoose from 'mongoose';
import { criterioSchemaTestUser } from '../database/models/shemas/criterioTest';

export const physicalTestSchema = new mongoose.Schema<IphysicalTest>({
	date: Date,
	test: [criterioSchemaTestUser]
}, { _id: false });