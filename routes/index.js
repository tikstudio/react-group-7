import express from 'express';
import users from './users';
import candidates from './candidates';
import people from './people';

const router = express.Router();

router.use('/users', users);
router.use('/people', people);
router.use('/candidates', candidates);

export default router;
