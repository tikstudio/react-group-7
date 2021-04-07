import fs from 'fs';
import HttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { Users } from '../models';

const { JWT_SECRET } = process.env;

// SELECT p.*, m.meta_value as price from wp_posts as p
// JOIN wp_postmeta as m on m.post_id = p.ID
// WHERE p.post_type = "product"
// AND m.meta_key = "_regular_price"
// LIMIT 10

class UsersController {
  static myAccount = async (req, res, next) => {
    try {
      const user = await Users.findByPk(req.userId);

      // Posts.findAll({
      //   include: [{
      //     model: PostMeta,
      //     where: {
      //       meta_key: "_regular_price"
      //     },
      //     attributes: [
      //       ['meta_value', 'price']
      //     ]
      //   }],
      //   attributes: {
      //     exclude: ['ping_status'],
      //     include: [[literal('max(authorId)'), 'num']]
      //   },
      //   where: {
      //     post_type: "product"
      //   },
      //   limit: 10
      // })
      res.json({
        user,
      });
    } catch (e) {
      next(e);
    }
  }

  static register = async (req, res, next) => {
    try {
      const { file } = req;
      const {
        email, firstName, lastName, password,
      } = req.body;

      const user = await Users.create({
        email, firstName, lastName, password,
      });

      const fileTypes = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
      };

      const imageDir = `public/images/${user.id}/`;
      if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
      }
      const avatar = `${file.fieldname}-${Date.now()}${fileTypes[file.mimetype]}`;
      fs.writeFileSync(imageDir + avatar, file.buffer);

      // await Users.update({
      //   avatar
      // }, {
      //   where: {
      //     id: user.id
      //   }
      // });

      user.avatar = avatar;
      await user.save();

      res.json({
        status: 'ok',
        user,
      });
    } catch (e) {
      next(e);
    }
  }

  static login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({
        where: {
          email,
        },
      });

      if (!user || user.getDataValue('password') !== Users.passwordHash(password)) {
        throw HttpError(403, 'invalid email or password');
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET);

      res.json({
        status: 'ok',
        user,
        token,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default UsersController;
