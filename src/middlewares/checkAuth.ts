import { capture } from './errorhandler';

export const checkAuth = (roles: string[]) => capture(async (req, res, next) => {
	const user = req.getUser();
	if(!user) throw Error('Ese usuario no se encuentra registrado');
	if(roles.length && !(roles.includes(user.role.toString()))) throw Error('Este usuario no tiene permiso para realizar esa accion');
	next();
});