import crypto from 'crypto';
import { DateTime } from 'luxon';
import { logger } from '../logger/winston';

export const encrypPassword = (password) => {
	const hash = crypto.createHash('sha256');
	hash.update(password);
	return hash.digest('hex');
};

export const comparePassword = (password, encrypedPassword) => {
	const newPassword = encrypPassword(password);
	logger.info(newPassword);
	logger.info(encrypedPassword);
	return newPassword === encrypedPassword;
};

export const getNewWebToken = (userId) => {
	const token = crypto.randomBytes(64).toString('hex');
	return({
		userId,
		token,
		ttl: DateTime.now().plus({ hour: 1 }).toJSDate(),
	});
};