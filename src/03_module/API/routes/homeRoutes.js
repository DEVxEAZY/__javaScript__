import { Router } from 'express';
import homeController from '../controllers/HomeController.js';

const router = Router();

// Montado em app.js com app.use('/home', ...) → GET /home
router.get('/', homeController.index);

export default router;