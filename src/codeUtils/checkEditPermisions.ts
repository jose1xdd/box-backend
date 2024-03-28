export const checkEditPermition = async (userToken:IUserDocument, userIdUpdate) =>{
	if(userToken.role != 'Admin' && userIdUpdate != userToken._id) throw Error('El usuario no tiene permiso de edicion');
	return true;
};
