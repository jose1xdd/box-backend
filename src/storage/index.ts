import multer from 'multer';
import { storages } from './firebase';
import path from 'path';
import fs from 'fs';
import { logger } from '../logger/winston';

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
export function emptyUploadFolder() {
	const folderPath = `${__dirname}/../uploads`;
	fs.readdir(folderPath, (err, filesD) => {
		filesD.forEach((file) => {
			const filePath = path.join(folderPath, file);
			fs.unlink(filePath, () => {});
		});
	});
}

export async function saveUserImages(file, userId) {
	const extension = path.extname(file.originalname);
	const nombreAutoGenerado = `${file.fieldname}-${Date.now()}`;
	const remoteFilePath = `game-field/${userId}/${nombreAutoGenerado}${extension}`;

	const storageFile = storageBucket.file(remoteFilePath);
	const blobStream = storageFile.createWriteStream({
		metadata: {
			contentType: file.mimetype, // Establece el tipo de contenido de la imagen
		},
	});

	await blobStream.on('finish', () => {
		logger.info('image uploaded');
	});
	const readStream = fs.createReadStream(file.path);
	readStream.pipe(blobStream);
}
export const upload = multer({ storage });