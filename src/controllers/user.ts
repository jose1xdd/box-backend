import mongoose from 'mongoose';
import { encrypPassword } from '../codeUtils/security';
import { User } from '../database/models/user';
import { capture } from '../middlewares/errorhandler';

export const userController = {

	//create an initial user
	create: capture(async (req, res)=>{
		const user = await User.findOne({ email: req.body.email });
		//If user its repeat
		if (user) throw Error('El usuario ya se encuentra registrado');
		//Encrypt the password
		req.body.password = encrypPassword(req.body.password);
		const data = await User.create(req.body);
		res.send({ user: data });
	}),

	//update an user
	updateUser: capture(async (req, res)=>{
		const userId = req.query.userId as string;
		const data = req.body;
		//If user id is not valid
		if(!mongoose.Types.ObjectId.isValid(userId)) throw Error('El ID del usuario no es valido');
		const user = await User.updateUser(userId, data);
		//If user not exists
		if (!user) throw Error('El usuario no se encuentra registrado');
		res.send({ user: user });
	}),

	//get an user by id
	getUser: capture(async (req, res)=>{
		const userId = req.query.userId as string;
		//If user id is not valid
		if(!mongoose.Types.ObjectId.isValid(userId)) throw Error('El ID del usuario no es valido');
		const user = await User.getUserById(userId);
		//If user not exists
		if (!user) throw Error('El usuario no se encuentra registrado');
		res.send({ user: user });
	}),

	//get the user list
	getUsersList: capture(async (req, res)=>{
		const limit = parseInt(req.query.limit as string);
		const role = req.query.role as string;
		const users = await User.getUserListByRole(limit, role);
		res.send({ users: users });
	})
};