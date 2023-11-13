import { decrypt } from '../codeUtils/security';
import { validateToken } from '../codeUtils/webToken';
import { User } from '../database/models/user';
import { WebToken } from '../database/models/webToken';
import { capture } from './errorhandler';

export const checkEditPermition = capture(async (req, res, next) =>{
	const token = req.headers.sessiontoken;
	const userId = req.query.userId;
	if(!token) throw Error('No se ha enviado el token de sesión');
	if(!validateToken(token)) throw Error('El token no es valido');
	const exist = await WebToken.findOne({ token: decrypt(token) });
	if(!exist) throw Error('La sesion ha acabado, logeate otra vez');
	const user = await User.findOne({ _id: exist.userId });
	if(!user) throw Error('Ese token no esta asociado a ningun usuario');
	if(user.role != 'Admin' && userId != user.userId) throw Error('El usuario no tiene permiso de edicion');
	next();
});
