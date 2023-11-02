import express from 'express';
import { logger } from './logger/winston';
const app = express();

app.listen(8020,()=>{
	logger.info('Servidor Corriendo en el Puerto 8020');
});

app.get('/',(req,res)=>{
	res.send('hola mundo');
});