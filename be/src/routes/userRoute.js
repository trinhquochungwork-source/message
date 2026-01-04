import { Router } from 'express';
import { authMe } from '../controllers/userController.js';
const router = Router();
router.get('/me', authMe);
export default router;
