import mongoose from 'mongoose';
import { inspect, logger } from '../logger/winston';

export const connection = async () => {
	const uri = process.env.MONGODB_URI;
	if (!uri) throw Error('URI de conexión no definido');
	mongoose.set('debug', (collectionName, method, query, doc) => {
		logger.info(`> MongoDB: ${collectionName}.${method}(${JSON.stringify(query, null, 2)})`);
		if (doc) logger.info(`> MongoDB: ${inspect(doc)}`);
	});

	try {
		await mongoose.connect(uri);
		logger.info('Conexión con MongoDB establecida');
	} catch (error) {
		logger.error('No se pudo conectar a MongoDB', error);
	}
};
