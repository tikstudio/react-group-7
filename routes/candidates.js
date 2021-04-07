import express from 'express';
import CandidatesController from '../controllers/CandidatesController';

const router = express.Router();

router.get('/', CandidatesController.list);

export default router;
