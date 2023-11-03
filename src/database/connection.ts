import mongoose from 'mongoose';
import { logger } from '../logger/winston';

export const connection = async () => {
	const uri = process.env.MONGODB_URI;
	if(!uri) throw Error('URI de conexion no definido');
	await mongoose.connect(uri)
		.then(()=>{
			logger.info('Conexion con mongo establecida');
		})
		.catch((error)=>{
			logger.error('No se pudo conectar a la mongo', error);

		});
};