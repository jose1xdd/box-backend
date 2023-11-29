import { logger } from '../logger/winston';
import { configDotenv } from 'dotenv';
import * as admin from 'firebase-admin';

configDotenv();

const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID,
	measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const app = admin.initializeApp(firebaseConfig);
const storages = app.storage();
logger.info('conexion a firebase');

export { app, storages };