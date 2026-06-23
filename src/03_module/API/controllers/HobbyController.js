import { ConflictError, NotFoundError, ValidationError } from "../errors/domainErrors.js"
import * as hobbyService from '../services/HobbyService.js';
import { responderErroDeDominio } from '../utils/responderErroDeDominio.js';

class HobbyController {
    async index(req, res) {
        try {
            const hobbies = await hobbyService.listar();
            return res.json(hobbies);
        } catch (err) {
            const resposta = responderErroDeDominio(res, err);
            if (resposta) return resposta;
            throw err;
        }
    }
}