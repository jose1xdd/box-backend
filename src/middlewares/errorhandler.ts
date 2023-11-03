import {
	NextFunction,
	Request,
	Response
} from 'express';
import { logger } from '../logger/winston';

export const capture = (callback:CallBack) =>
	async (req:Request, res:Response, next:NextFunction)=>{
		try{
			return await callback(req, res, next);

		}
		catch(err){
			errorPrint(err, req, res, next);
		}
	};
export const errorPrint = (err, req, res, next) => {
	logger.error(err.stack);

	if (res.headersSent) {
		return next(err);
	}

	res.setHeader('Content-Type', 'application/json');
	res.status(500).json({ error: err.message });

};