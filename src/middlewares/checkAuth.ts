import { capture } from './errorhandler';
import { WebToken } from '../database/models/webToken';
import { decrypt } from '../codeUtils/security';
import { User } from '../database/models/user';

export const checkAuth = (roles: string[]) => capture(async (req, res, next) => {
	const webToken = req.headers.sessiontoken as string;
	const infoToken = await WebToken.findOne({ token: decrypt(webToken) });
	const idUser = infoToken?.userId;
	const user = await User.findOne({ _id: idUser });
	if(!user) throw Error('Ese usuario no se encuentra registrado');
	if(roles.length && !(roles.includes(user.role))) throw Error('Este usuario no tiene permiso para realizar esa accion');
	next();
});