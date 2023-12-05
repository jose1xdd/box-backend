import { logger } from '../logger/winston';
import { configDotenv } from 'dotenv';
import * as admin from 'firebase-admin';

configDotenv();

const firebaseConfig = {
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
};
const service = process.env.SERVICEACCOUNT;
const app = admin.initializeApp({
	credential: service ? admin.credential.cert(service) : undefined,
	...firebaseConfig
});
const storages = app.storage();
logger.info('conexion a firebase');

export { app, storages };