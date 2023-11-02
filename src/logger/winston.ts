import { DateTime } from 'luxon';
import winston, { format } from 'winston';

export const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		format.timestamp({
			format: ()=> DateTime.now().toFormat('yyyy-MM-dd HH:mm'),
		}),
		winston.format.printf(({ timestamp, message }) => {
			return `[${timestamp}]: ${message}`;
		}),
		winston.format.colorize({
			all: true,
		}),
	),
	transports: [
		new winston.transports.Console(),
	],
});
