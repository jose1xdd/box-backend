import { capture } from './errorhandler';
import { WebToken } from '../database/models/webToken';
import { decrypt } from '../codeUtils/security';
import { User } from '../database/models/user';
import { logger } from '../logger/winston';

export const checkAuth = (roles: [string]) => capture(async (req, res, next) => {
	if(!roles) next();
	const webToken = req.headers.sessiontoken as string;
	const infoToken = await WebToken.findOne({ token: decrypt(webToken) });
	const idUser = infoToken?.userId;
	const user = await User.findOne({ _id: idUser });
	if(!user) throw Error('Ese usuario no se encuentra registrado');
	logger.info(user.role as string);
	logger.info(typeof(roles));
	logger.info(user.role in roles);
	if(!(roles.includes(user.role))) throw Error('Este usuario no tiene permiso para realizar esa accion');
	next();
});