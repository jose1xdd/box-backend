import mongoose from 'mongoose';
import crypto from 'crypto';
import { encrypPassword } from '../codeUtils/security';
import { User } from '../database/models/user';
import { capture } from '../middlewares/errorhandler';
import { Club } from '../database/models/club';
import { WeightCategory } from '../database/models/weightCategory';
import { DisableUser } from '../database/models/disabledUsers';
import { Role } from '../database/models/role';
import { CriterioTest } from '../database/models/criterioTest';
import * as ExcelJS from 'exceljs';
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
			wCategory = await WeightCategory.findById(data.weightCategory);
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

	//Create a trainer
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

	//Create an admin
	createGenericUser: capture(async (req, res)=>{
		const data = req.body;
		const roleId = data.role;
		if(!mongoose.Types.ObjectId.isValid(roleId)) throw Error('El ID del rol no es valido');
		const existRole = await Role.findById(roleId, { _id: 0, __v: 0 });
		if (!existRole) throw Error('No existe un rol asociado a  ese id ');
		//If user its repeat
		const user = await User.findOne({ $or: [{ email: data.email }, { cedula: data.cedula }] });
		if (user) throw Error('El usuario ya se encuentra registrado');

		//Encrypt the password
		const password = crypto.randomBytes(8).toString('hex');
		data.password = encrypPassword(password);
		//Asign role
		data.role = existRole;
		//create the user
		const result = await User.create(data);
		result.password = password;
		res.send({ user: result });
	}),

	//update a deportista
	updateDeportista: capture(async (req, res)=>{
		const userId = req.query.userId as string;
		const data = req.body;
		//If user id is not valid
		if(!mongoose.Types.ObjectId.isValid(userId)) throw Error('El ID del usuario no es valido');
		const user = await User.getUserById(userId);
		if(!user) throw Error('No hay un usuario registrado a ese Id');
		//Valid the club id
		let club;
		if(data.club){
			if(!mongoose.Types.ObjectId.isValid(data.club)) throw Error('El ID del club no es valido');
			club = await Club.getClubById(data.club);
			if(!club) throw Error('El club no se encuentra registrado');
		}

		//Valid the weightCategory
		let weightCategory;
		if(data.weightCategory){
			if(!mongoose.Types.ObjectId.isValid(data.weightCategory)) throw Error('El ID de la categoria de peso no es valido');
			weightCategory = await WeightCategory.findById(data.weightCategory);
			if(!weightCategory) throw Error('La categoria de peso no existe');
		}

		const result = await User.updateUser(userId, data);
		//change the club member
		if(data.club){
			if(data.club != user.club){
				//If user had a club already
				if(user.club) {
				//eliminate the user from de club's member list
					const pastClubId = user.club;
					const pastClub = await Club.findById(pastClubId);
					const indice = pastClub.members.indexOf(userId);
					pastClub.members.splice(indice, 1);
					await Club.updateClub(pastClubId, pastClub);
				}
				club.members.push(user['_id']);
				await Club.updateClub(club.id, club);
			}
		}
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

	//disable an user
	disableUser: capture(async (req, res)=>{
		const userId = req.query.userId as string;
		//If id is not valid
		if(!mongoose.Types.ObjectId.isValid(userId)) throw Error('El ID del usuario no es valido');
		//If user not exists
		const user = await User.getUserById(userId);
		if (!user) throw Error('El usuario no se encuentra registrado o activo');

		//Delete the user
		await User.deleteOne(user);
		await DisableUser.create({
			...user.toObject()
		});
		res.send({ users: 'Usuario eliminado' });
	}),

	//Create an admin
	createTestUser: capture(async (req, res)=>{
		const data = req.body;
		const userId = data.userId;
		const test = data.test;
		if(!mongoose.Types.ObjectId.isValid(userId)) throw Error('El ID del usuario no es valido');
		const exist = await User.findById(userId);
		if(!exist) throw Error('No existe un usuario asignado a ese id');
		if(exist.role != 'Deportista') throw Error('No se le puede hace una evaluacion a un usuario no deportista');
		for(const critery of test){
			const criteryId = critery.criteryId;
			if(!mongoose.Types.ObjectId.isValid(criteryId)) throw Error('El id de un criterio no es valido');
			const existC = await CriterioTest.findById(criteryId);
			if(!existC) throw Error('No existe un criterio asignado a ese id');
			delete critery.criteryId;
			critery.name = existC.name;
		}
		delete data.userId;

		const result = await User.addPhysicalTest(userId, data);
		res.send({ user: result });
	}),

	//download deportistas
	descargarUserDeportistas: capture(async (req, res)=>{
		const workbook = new ExcelJS.Workbook();
		const sheet = workbook.addWorksheet('usuario');
		const users = await User.getUserListByRole(undefined, 'Deportista');
		sheet.addRow(['NAME', 'LASTNAME', 'BIRTHDATE', 'CEDULA', 'EMAIL', 'WEIGTH', 'CATEGORIA', 'PHONE', 'ADDRESS', 'ROLE', 'CLUB']);
		for(const user of users) {
			const data: any = [];
			data.push(user.name);
			data.push(user.lastName);
			const birthdate = user.birthDate;
			data.push(birthdate.getDay() + '-' + (birthdate.getMonth() + 1) + '-' + birthdate.getFullYear());
			data.push(user.cedula);
			data.push(user.email);
			data.push(user.weight);
			const weightCategory = await WeightCategory.findById(user.weightCategory);
			if(!weightCategory) data.push('N/A');
			else data.push(weightCategory.name);
			data.push(user.phone);
			data.push(user.address);
			data.push(user.role);
			const club = await Club.findById(user.club);
			if(!club) data.push('N/A');
			else data.push(club.name);
			sheet.addRow(data);
		}
		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.setHeader('Content-Disposition', 'attachment; filename="Entrenadores_Reporte_' + Date.now() as string + '.xlsx"');
		await workbook.xlsx.write(res);
		res.send();
	}),

	//download entrenadores
	descargarUserEntrenadores: capture(async (req, res)=>{
		const workbook = new ExcelJS.Workbook();
		const sheet = workbook.addWorksheet('usuario');
		const users = await User.getUserListByRole(undefined, 'Entrenador');
		sheet.addRow(['NAME', 'LASTNAME', 'BIRTHDATE', 'CEDULA', 'EMAIL', 'PHONE', 'ADDRESS', 'ROLE']);
		for(const user of users) {
			const data: any = [];
			data.push(user.name);
			data.push(user.lastName);
			const birthdate = user.birthDate;
			data.push(birthdate.getDay() + '-' + (birthdate.getMonth() + 1) + '-' + birthdate.getFullYear());
			data.push(user.cedula);
			data.push(user.email);
			data.push(user.phone);
			data.push(user.address);
			data.push(user.role);
			sheet.addRow(data);
		}
		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.setHeader('Content-Disposition', 'attachment; filename="Deportistas_Reporte_' + Date.now() as string + '.xlsx"');
		await workbook.xlsx.write(res);
		res.send();
	})
};
