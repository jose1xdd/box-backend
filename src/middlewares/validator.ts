import * as yup from 'yup';
import { printErrorValidator } from './errorhandler';

export const bodyValidator = (object:yup.AnyObjectSchema)=>async (req, res, next)=>{
	try{
		object.noUnknown(true);
		await object.validate(req.body, { strict: true });
		next();

	}
	catch(err:any){
		printErrorValidator(err, req, res, next);
	}
};
export const paramsValidator = (object:yup.AnyObjectSchema)=>async (req, res, next)=>{
	try{
		await object.validate(req.params, { strict: true });
		next();

	}
	catch(err:any){
		printErrorValidator(err, req, res, next);
	}
};

export const queryValidator = (object:yup.AnyObjectSchema)=>async (req, res, next)=>{
	try{
		await object.validate(req.query, { strict: true });
		next();

	}
	catch(err:any){
		printErrorValidator(err, req, res, next);
	}
};

