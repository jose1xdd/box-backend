import { capture } from '../middlewares/errorhandler';
import User from '../database/models/user';
import WebToken from '../database/models/webToken';
import { comparePassword, getNewWebToken } from '../codeUtils/security';
import { DateTime } from 'luxon';
export const loginController = {

	login: capture(async (req, res)=>{
		const { email, password } = req.body;
		const user = await User.findOne({ email: email });
		//If user exist
		if(!user) throw Error('El usuario ya se encuentra registrado');
		//If password its correct
		if (!comparePassword(password, user.password)) throw Error('La constraseña o el usuario son incorrectos');
		//If token already exist
		const Token = await WebToken.findOne({ userId: user.id });
		let token;
		if(Token){
			//looking for the token
			token = await WebToken.findOneAndUpdate({ _id: Token.id }, { ttl: DateTime.now().plus({ hour: 1 }).toJSDate() }, { new: true });
		}else{
			//create Token
			token = await WebToken.create(getNewWebToken(user.id));
		}
		res.send({ token: token.token, userId: user.id });

	})
};