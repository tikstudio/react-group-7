import { Candidates, People } from '../models';

class CandidatesController {
  static list = async (req, res, next) => {
    try {
      // SELECT c.*, p.firstName, p.lastName FROM candidates as c
      // left JOIN people as p on c.peopleId = p.id

      const candidates = await Candidates.findAll({
        include: [{
          model: People,
        }],
      });

      // SELECT c.*, p.firstName, p.lastName FROM people as p
      // JOIN candidates as c on c.peopleId = p.id
      const candidates2 = await People.findAll({
        include: [{
          model: Candidates,
          required: true,
          as: 'candidate',
        }],
      });

      res.json({
        status: 'ok',
        candidates,
        candidates2,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default CandidatesController;
