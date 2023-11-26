import multer from 'multer';
import { storages } from './firebase';
import path from 'path';
import fs from 'fs';

export const storageBucket = storages.bucket();

const storage = multer.diskStorage({

	destination(req, file, cb) {

		const dir = path.join(__dirname, '../uploads');
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
		cb(null, dir);
	},
	filename(req, file, cb) {
		cb(null, file.originalname);
	},
});
export const upload = multer({ storage });