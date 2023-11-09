import crypto from 'crypto';

export const encrypPassword = (password) => {
	const hash = crypto.createHash('sha256');
	hash.update(password);
	return hash.digest('hex');
};

export const comparePassword = (password, encrypPassword) => {
	const newPassword = encrypPassword(password);
	return newPassword === encrypPassword;
};
