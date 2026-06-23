import { Router } from 'express';
import alunoController from '../controllers/AlunoController.js';

const router = Router();

// Montado em app.js com app.use('/alunos', ...) → GET /alunos
router.get('/', alunoController.index);

// POST /alunos
router.post('/', alunoController.store);

// GET /alunos/:id
router.get('/:id', alunoController.show);

export default router;
