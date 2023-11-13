import { encrypPassword } from '../codeUtils/security';
import { User } from '../database/models/user';
import { capture } from '../middlewares/errorhandler';

export const userController = {

	create: capture(async (req, res)=>{
		const user = await User.findOne({ email: req.body.email });
		//If user its repeat
		if (user) throw Error('El usuario ya se encuentra registrado');
		//Encrypt the password
		req.body.password = encrypPassword(req.body.password);
		const data = await User.create(req.body);
		res.send({ user: data });
	}),

	updateUser: capture(async (req, res)=>{
		const user = await User.updateUser(req.query.userId as string, req.body);
		//If user not exists
		if (!user) throw Error('El usuario no se encuentra registrado');
		res.send({ user: user });
	})
};