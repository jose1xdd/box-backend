import { decrypt } from './security';

export const validateToken = (token) => {
	const webToken = decrypt(token);
	if(!webToken) return false;
	return true;
};