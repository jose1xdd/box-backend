import nodemailer from 'nodemailer';
import { logger } from '../logger/winston';
const email = process.env.EMAIL;
const password = process.env.EMAIL_PASSWORD;

logger.warn(email);
logger.warn(password);
const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
		user: email,
		pass: password
	}
});
export function sendEmail(destinator:string[], subject:string, html:string) {
	transporter.sendMail({
		to: destinator,
		subject,
		html,
	});
}