import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../errors/domainErrors.js';

/** Mapeia erros de domínio para resposta HTTP; retorna null se não for erro conhecido. */
export function responderErroDeDominio(res, err) {
  // O operador instanceof verifica se err é uma instância da classe ValidationError
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message });
  }
  if (err instanceof ConflictError) {
    return res.status(409).json({ error: err.message });
  }
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }
  return null;
}
