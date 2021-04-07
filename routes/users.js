import express from 'express';
import multer from 'multer';
import UsersController from '../controllers/UsersController';

const router = express.Router();

//
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/images')
//   },
//   filename: function (req, file, cb) {
//     const fileTypes = {
//       'image/jpeg': '.jpg',
//       'image/png': '.png',
//       'image/gif': '.gif'
//     }
//     if (!fileTypes[file.mimetype]) {
//       cb(HttpError('Invalid File type'));
//       return;
//     }
//     cb(null, file.fieldname + '-' + Date.now() + fileTypes[file.mimetype])
//   }
// })
//
// const upload = multer({ storage: storage })

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', UsersController.myAccount);

router.post('/register', upload.single('avatar'), UsersController.register);

router.post('/login', UsersController.login);

export default router;
