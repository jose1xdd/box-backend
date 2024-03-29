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
import {
	emptyUploadFolder,
	getUserImage,
	saveUserImages,
	validateUserImages
} from '../storage';
import { checkEditPermition } from '../codeUtils/checkEditPermisions';
import { Code } from '../database/models/code';
import { sendEmail } from '../mails';
import { comunicate, recoveryPassword } from '../mails/templates';
import {
	expectedHeaders,
	expectedHeadersTrainer,
	formatStringdDate
} from '../codeUtils/globals';
import { DateTime } from 'luxon';
import { logger } from '../logger/winston';
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
		checkEditPermition(req.getUser(), userId);
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
		checkEditPermition(req.getUser(), userId);
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
		const { userId } = data;
		const { test } = data;
		if(!mongoose.Types.ObjectId.isValid(userId)) throw Error('El ID del usuario no es valido');
		const exist = await User.findById(userId);
		if(!exist) throw Error('No existe un usuario asignado a ese id');
		if(exist.role != 'Deportista') throw Error('No se le puede hace una evaluacion a un usuario no deportista');
		for(const critery of test){
			const { criteryId } = critery;
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
	}),
	uploadProfilePhoto: capture(async (req, res)=>{
		const { userId } = req.params;
		checkEditPermition(req.getUser(), userId);
		if(req.getUserId() !== userId){
			const user = await User.findById(userId);
			if(!user)throw new Error('El usuario a modificar no existe');
		}
		if(!req.files) throw new Error('No se envio el archivo');
		const files = req.files as Express.Multer.File[];
		await validateUserImages(userId);
		for(const file of files){
			await saveUserImages(file, userId);
		}
		emptyUploadFolder();
		res.send({});
	}),
	getProfilePhoto: capture(async (req, res)=>{
		const { userId } = req.params;
		const user = await User.findById(userId);
		if(!user)throw new Error('El usuario del cual se quiere consultar la foto no existe');
		const result = await getUserImage(userId);
		res.send({ image: result[0] });
	}),
	generatePasswordCode: capture(async (req, res)=>{
		const { email } = req.body;
		const user = await User.getUserByEmail(email);
		if(!user) throw new Error('No hay un usuario asociado a ese email');
		const fetchedCode = await Code.fetchCodeByuserId(user._id);
		if(fetchedCode) throw new Error('Codigo pendiente');
		const code = crypto.randomInt(100000, 999999).toString();
		await Code.createCode(user._id, code);
		sendEmail([email], 'Recuperacion de contraseña', recoveryPassword(email, code));
		res.send({});
	}),
	updatePassword: capture(async (req, res)=>{
		const { email, code, password } = req.body;
		const user = await User.getUserByEmail(email);
		if(!user) throw new Error('No hay un usuario asociado a ese email');
		const codeFetched = await Code.fetchCodeByCode(user._id, code);
		if(!codeFetched)throw new Error('No hay un codigo para este usuario');
		await Code.deleteCodeByCode(codeFetched.userId, codeFetched.code);
		const newPassword = encrypPassword(password);
		await User.updateUser(user._id, { password: newPassword });
		res.send({});
	}),
	sendComunicates: capture(async (req, res)=>{
		const { emails, subject, message } = req.body;
		emails.map((element)=>{
			sendEmail([element], subject, comunicate(subject, message, element));
		});
		res.send({});
	}),
	uploadMasiveSportman: capture(async (req, res)=>{
		if(!req.file) throw new Error('No se envio un archivo');
		const workbook = new ExcelJS.Workbook();
		await workbook.xlsx.readFile(req.file.path);
		const worksheet = workbook.worksheets[0];

		const headers:string [] = [];
		worksheet.getRow(1).eachCell((cell) => {
			if(cell.value) headers.push(cell.value.toString());
		});

		const isValid = JSON.stringify(headers) === JSON.stringify(expectedHeaders);
		if(!isValid) throw new Error('Excel invalido');
		const users: Partial<Iuser> [] = [];
		let invalidUsers: string = '';

		worksheet.eachRow({ includeEmpty: false }, async (row)=>{
			const rowEach = row.values;
			const user:Partial<Iuser> = { name: rowEach[1], lastName: rowEach[2], birthDate: rowEach[3], cedula: rowEach[4], email: rowEach[5], weight: rowEach[6], phone: rowEach[7], address: rowEach[8] };
			users.push(user);
		});
		users.splice(0, 1);
		for(const user of users){
			if(user.email && user.birthDate){
				const userExist = await User.getUserByEmail(user.email);
				if(userExist) {
					invalidUsers += `${user.email}\n`;
				}
				else {
					user.birthDate = DateTime.fromFormat(user.birthDate.toString(), formatStringdDate).toJSDate();
					user.weight = user.weight as number;
					await User.create({ ...user });
				}
			}
		}
		if(invalidUsers.length > 0)res.send({ message: `Los siguientes usuarios no se pudieron registrar, por que sus emails ya estan registrados:\n${invalidUsers}` });
		else res.send({ message: 'Se agregaron los usuario' });
		emptyUploadFolder();
	}),
	uploadMasiveTrainer: capture(async (req, res)=>{
		if(!req.file) throw new Error('No se envio un archivo');
		const workbook = new ExcelJS.Workbook();
		await workbook.xlsx.readFile(req.file.path);
		const worksheet = workbook.worksheets[0];

		const headers:string [] = [];
		worksheet.getRow(1).eachCell((cell) => {
			if(cell.value) headers.push(cell.value.toString());
		});
		logger.warn(headers);
		logger.warn(expectedHeadersTrainer);
		const isValid = JSON.stringify(headers) === JSON.stringify(expectedHeadersTrainer);
		if(!isValid) throw new Error('Excel invalido');
		const users: Partial<Iuser> [] = [];
		let invalidUsers: string = '';

		worksheet.eachRow({ includeEmpty: false }, async (row)=>{
			const rowEach = row.values;
			const user:Partial<Iuser> = { name: rowEach[1], lastName: rowEach[2], birthDate: rowEach[3], cedula: rowEach[4], email: rowEach[5], weight: rowEach[6], phone: rowEach[7], address: rowEach[8], role: 'Entrenador' };
			users.push(user);
		});
		users.splice(0, 1);
		for(const user of users){
			if(user.email && user.birthDate){
				const userExist = await User.getUserByEmail(user.email);
				if(userExist) {
					invalidUsers += `${user.email}\n`;
				}
				else {
					user.birthDate = DateTime.fromFormat(user.birthDate.toString(), formatStringdDate).toJSDate();
					user.weight = user.weight as number;
					await User.create({ ...user });
				}
			}
		}
		if(invalidUsers.length > 0)res.send({ message: `Los siguientes usuarios no se pudieron registrar, por que sus emails ya estan registrados:\n${invalidUsers}` });
		else res.send({ message: 'Se agregaron los usuario' });
		emptyUploadFolder();
	})
};
