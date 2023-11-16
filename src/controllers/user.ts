import mongoose from 'mongoose';
import crypto from 'crypto';
import { encrypPassword } from '../codeUtils/security';
import { User } from '../database/models/user';
import { capture } from '../middlewares/errorhandler';
import { Club } from '../database/models/club';
import { weightCategory } from '../database/models/weightCategory';
export const userController = {

	//create an deportista user
	createDeportista: capture(async (req, res)=>{
		const data = req.body;
		const user = await User.findOne({ $or: [{ email: data.email }, { cedula: data.cedula }] });

		//If user its repeat
		if (user) throw Error('El usuario ya se encuentra registrado');

		//Encrypt the password
		const password = crypto.randomBytes(8).toString('hex');
		data.password = encrypPassword(password);

		//assign the user´s club
		let club;
		if(data.club) {
			if(!mongoose.Types.ObjectId.isValid(data.club)) throw Error('El ID del club no es valido');
			club = await Club.getClubById(data.club);
			if(!club) throw Error('El club no se encuentra registrado');
		}

		//assign the user´s category
		let wCategory;
		if(data.weightCategory) {
			if(!mongoose.Types.ObjectId.isValid(data.weightCategory)) throw Error('El ID de la categoria de peso no es valido ');
			wCategory = await weightCategory.findById(data.weightCategory);
			if(!wCategory) throw Error('Esa categoria no se encuentra registrada');
		}

		//create the user
		const result = await User.create(data);
		result.password = password;

		//Update club'member list
		if(club) {
			club.members.push(result['_id']);
			await Club.updateClub(club['_id'], club);
		}
		res.send({ user: result });
	}),

	//Create an admin
	createAdmin: capture(async (req, res)=>{
		const data = req.body;
		const user = await User.findOne({ $or: [{ email: data.email }, { cedula: data.cedula }] });

		//If user its repeat
		if (user) throw Error('El usuario ya se encuentra registrado');

		//Encrypt the password
		const password = crypto.randomBytes(8).toString('hex');
		data.password = encrypPassword(password);

		//Asign role
		data.role = 'Admin';

		//create the user
		const result = await User.create(data);
		result.password = password;

		res.send({ user: result });
	}),

	//Create an admin
	createTrainer: capture(async (req, res)=>{
		const data = req.body;
		const user = await User.findOne({ $or: [{ email: data.email }, { cedula: data.cedula }] });

		//If user its repeat
		if (user) throw Error('El usuario ya se encuentra registrado');

		//Encrypt the password
		const password = crypto.randomBytes(8).toString('hex');
		data.password = encrypPassword(password);

		//Asign role
		data.role = 'Entrenador';

		//create the user
		const result = await User.create(data);
		result.password = password;

		res.send({ user: result });
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
	}),

	//update user´s club
	updateUserClub: capture(async (req, res)=>{
		const clubId = req.body.clubId as string;
		const userId = req.query.userId as string;
		//If user id is not valid
		if(!mongoose.Types.ObjectId.isValid(userId)) throw Error('El ID del user no es valido');
		//If club is is not valid
		if(!mongoose.Types.ObjectId.isValid(clubId)) throw Error('El ID del club no es valido');
		//If user not exist
		let user = await User.findById(userId);
		if(!user) throw Error('El usuario no se encuentra registrado');
		//If club not exist
		const club = await Club.findById(clubId);
		if(!club) throw Error('El club no se encuentra registrado');

		if(club._id != user.club){
		//If user had a club already
			if(user.club) {
			//eliminate the user from de club's member list
				const pastClubId = user.club;
				const pastClub = await Club.findById(pastClubId);
				const indice = pastClub.members.indexOf(userId);
				pastClub.members.splice(indice, 1);
				await Club.updateClub(pastClubId, pastClub);
			}
			//Update the user
			user.club = clubId;
			user = await User.updateUser(userId, user);
			//agregate the user at new club's member list
			club.members.push(user['_id']);
			await Club.updateClub(clubId, club);
		}

		res.send({ user: user });
	}),
};