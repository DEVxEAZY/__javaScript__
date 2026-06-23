import { Router } from 'express';
import usuarioController from '../controllers/UsuarioController.js';

const router = Router();

// Montado em app.js com app.use('/usuarios', ...) → POST /usuarios
router.post('/', usuarioController.store);

// Montado em app.js com app.use('/usuarios', ...) → GET /usuarios/:id
router.get('/:id', usuarioController.showInfo);



export default router;
