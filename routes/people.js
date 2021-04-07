import express from 'express';
import PeopleController from '../controllers/PeopleController';

const router = express.Router();

router.post('/authorize', PeopleController.authorize);

router.post('/vote', PeopleController.votePeople);

// router.get('/:id', PeopleController.addCreate);

router.post('/', PeopleController.addCreate);

router.put('/:id', PeopleController.personUpdate);

router.delete('/:id', PeopleController.personDelete);

router.delete('/posts/:id', PeopleController.personDelete);

export default router;
