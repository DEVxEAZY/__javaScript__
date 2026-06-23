

import * as usuarioService from '../services/UsuarioService.js';
import { responderErroDeDominio } from '../utils/responderErroDeDominio.js';

class UsuarioController {
  async store(req, res) {
    const { email, senha } = req.body ?? {};

    try {
      const usuario = await usuarioService.criar({ email, senha });
      return res.status(201).json(usuario);
    } catch (err) {
      const resposta = responderErroDeDominio(res, err);
      if (resposta) return resposta;
      throw err;
    }
  }

  async showInfo(req, res) {
    const { id } = req.params;

    try {
      const perfil = await usuarioService.buscarPerfilPublico(id);
      return res.json(perfil);
    } catch (err) {
      const resposta = responderErroDeDominio(res, err);
      if (resposta) return resposta;
      throw err;
    }
  }
}

export default new UsuarioController();
