import { configDotenv } from 'dotenv';
import express from 'express';
import { connection } from './database/connection';
import { logger } from './logger/winston';
//import { capture } from './middlewares/errorhandler';

configDotenv();
connection();
const app = express();

app.listen(8020, ()=>{
	logger.info('Servidor Corriendo en el Puerto 8020');
});
/*
const x = {
	as: capture((req, res)=>{
		throw Error('fredo godofredo');
	}),
};
*/
app.get('/');