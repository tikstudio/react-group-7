import { literal } from 'sequelize';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import HttpError from 'http-errors';

import { Candidates, People } from '../models';

const { JWT_SECRET } = process.env;

class PeopleController {
  static authorize = async (req, res, next) => {
    try {
      const { passport } = req.body;
      /* const now = moment();
       const startDate = moment().set({ hour: 8, minute: 30 });
       const endDate = moment().set({ hour: 20, minute: 30 });

       if (now < startDate) {
         throw HttpError(422, 'vote isn`t started yet');
       }
       if (now > endDate) {
         throw HttpError(422, 'vote already finished');
       } */

      const person = await People.findOne({
        where: { passport },
      });

      if (!person) {
        throw HttpError(404);
      }
      if (person.votedData) {
        throw HttpError(403, 'You are already voted');
      }

      const token = jwt.sign({ personId: person.id }, JWT_SECRET);
      res.json({
        token,
        person,
      });
    } catch (e) {
      next(e);
    }
  }

  static addCreate = async (req, res, next) => {
    try {
      const {
        firstName, lastName, middleName, passport, votedData,
      } = req.body;
      const people = await People.create({
        firstName, lastName, middleName, passport, votedData,
      });
      res.json({
        status: 'ok',
        people,
      });
    } catch (e) {
      next(e);
    }
  }

  static personUpdate = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { firstName, lastName } = req.body;
      await People.update({
        firstName, lastName,
      }, {
        where: {
          id,
        },
      });

      const people = await People.findByPk(id);
      res.json({
        status: 'ok',
        people,
      });
    } catch (e) {
      next(e);
    }
  }

  static personDelete = async (req, res, next) => {
    try {
      const { id } = req.params;
      await People.destroy({
        where: {
          id,
        },
      });
      res.json({
        status: 'ok',
      });
    } catch (e) {
      next(e);
    }
  }

  static votePeople = async (req, res, next) => {
    try {
      const { id, token } = req.body;

      const { personId } = jwt.verify(token, JWT_SECRET);
      const person = await People.findByPk(personId);

      if (person.votedData) {
        throw HttpError(403, 'You are already voted');
      }

      person.votedData = moment().format('HH:mm:ss');
      await person.save();

      // await People.update({
      //   votedData: moment().format('HH:mm:ss'),
      // }, {
      //   where: {
      //     id: personId,
      //   },
      // });

      await Candidates.update({
        votes: literal('votes + 1'),
      }, {
        where: {
          id,
        },
      });
      res.json({
        status: 'ok',
      });
    } catch (e) {
      next(e);
    }
  }
}

export default PeopleController;
