import crypto from 'crypto';
import JSEncrypt from 'node-jsencrypt';
import { publicKey, privateKey } from '../Auth/Keys';
export const encrypPassword = (password) => {
	const hash = crypto.createHash('sha256');
	hash.update(password);
	return hash.digest('hex');
};

export const comparePassword = (password, encrypedPassword) => {
	const newPassword = encrypPassword(password);
	return newPassword === encrypedPassword;
};

export const getNewWebToken = () => {
	const token = crypto.randomBytes(64).toString('hex');
	return token;
};

export const encrypt = (message): string => {
	const cr = new JSEncrypt();
	cr.setKey(publicKey);
	return cr.encrypt(message);
};

export const decrypt = (encryptedMessage): string => {
	const cr = new JSEncrypt();
	cr.setPrivateKey(privateKey);
	return cr.decrypt(encryptedMessage);
};