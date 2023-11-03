import {
	NextFunction,
	Request,
	Response
} from 'express';

declare global {
    export type CallBack = (req:Request, res:Response, next:NextFunction)=>Promise<any>
}