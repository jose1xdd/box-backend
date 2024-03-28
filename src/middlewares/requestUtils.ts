import { RequestHandler } from 'express';
import { capture } from './errorhandler';

export const requestUtils: RequestHandler = capture((req, _, next) => {
	req.getUser = () => req.box.session.user;
	req.getUserId = () => req.box.session.user._id.toString();
	next();
});