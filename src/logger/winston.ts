import { DateTime } from 'luxon';
import winston, { format } from 'winston';

// Formato personalizado para objetos
const customObjectFormat = format((info) => {
	if (info instanceof Error) {
		return info;
	}

	if (info.message && typeof info.message === 'object') {
		info.message = JSON.stringify(info.message, null, 2);
	}

	return info;
});

export const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		format.timestamp({
			format: () => DateTime.now().toFormat('yyyy-MM-dd HH:mm'),
		}),
		// Agregar el formato personalizado para objetos aquí
		customObjectFormat(),
		winston.format.printf(({ timestamp, message }) => {
			return `[${timestamp}]: ${message}\n`;
		}),
		winston.format.colorize({
			all: true,
		}),
	),
	transports: [new winston.transports.Console()],
});
