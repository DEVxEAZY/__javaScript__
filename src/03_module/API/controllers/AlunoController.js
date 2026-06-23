import * as alunoService from '../services/AlunoService.js';
import { responderErroDeDominio } from '../utils/responderErroDeDominio.js';

class AlunoController {
  async index(req, res) {
    try {
      const alunos = await alunoService.listar();
      return res.json(alunos);
    } catch (err) {
      const resposta = responderErroDeDominio(res, err);
      if (resposta) return resposta;
      throw err;
    }
  }

  async store(req, res) {
    try {
      const aluno = await alunoService.criar(req.body);
      return res.status(201).json(aluno);
    } catch (err) {
      const resposta = responderErroDeDominio(res, err);
      if (resposta) return resposta;
      throw err;
    }
  }

  async show(req, res) {
    try {
      const aluno = await alunoService.buscarPorId(req.params.id);
      return res.json(aluno);
    } catch (err) {
      const resposta = responderErroDeDominio(res, err);
      if (resposta) return resposta;
      throw err;
    }
  }
}

export default new AlunoController();
