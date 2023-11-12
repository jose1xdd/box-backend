import { decrypt } from '../codeUtils/security';
import { validateToken } from '../codeUtils/webToken';
import { WebToken } from '../database/models/webToken';
import { capture } from './errorhandler';
import { User } from '../database/models/user';

export const checkSession = capture(async (req, res, next) => {
	const token = req.headers.sessiontoken as string;
	if(!token) throw Error('No se ha enviado el token de sesión');
	if(!validateToken(token)) throw Error('El token no es valido');
	const exist = await WebToken.findOne({ token: decrypt(token) });
	if(!exist) throw Error('La sesion ha acabado, logeate otra vez');
	const user = await User.findOne({ _id: exist.userId });
	if(!user) throw Error('Ese token no esta asociado a ningun usuario');
	next();
});
