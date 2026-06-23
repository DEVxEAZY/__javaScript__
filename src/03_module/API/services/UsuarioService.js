import prisma from '../database/prisma.js';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../errors/domainErrors.js';
import { hashSenha } from '../utils/password.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENHA_MIN = 6;

function usuarioPublico(usuario) {
  const { senhaHash, ...rest } = usuario;
  return rest;
}

function perfilPublico(usuario) {
  return {
    id: usuario.id,
    email: usuario.email,
    createdAt: usuario.createdAt,
    updatedAt: usuario.updatedAt,
  };
}

function parseId(idParam) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id < 1) {
    throw new ValidationError('id inválido');
  }
  return id;
}

function validarCadastro({ email, senha }) {
  if (!email?.trim() || !senha) {
    throw new ValidationError('email e senha são obrigatórios');
  }

  const emailNormalizado = email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(emailNormalizado)) {
    throw new ValidationError('email inválido');
  }

  if (senha.length < SENHA_MIN) {
    throw new ValidationError(
      `senha deve ter no mínimo ${SENHA_MIN} caracteres`,
    );
  }

  return { emailNormalizado, senha };
}

/** Cria usuário; retorna dados públicos (sem senhaHash). */
export async function criar({ email, senha }) {
  const { emailNormalizado, senha: senhaPlana } = validarCadastro({
    email,
    senha,
  });

  try {
    const senhaHash = await hashSenha(senhaPlana);
    const usuario = await prisma.usuario.create({
      data: {
        email: emailNormalizado,
        senhaHash,
      },
    });
    return usuarioPublico(usuario);
  } catch (err) {
    if (err.code === 'P2002') {
      throw new ConflictError('email já cadastrado');
    }
    throw err;
  }
}

/** Perfil público por id; lança NotFoundError se não existir. */
export async function buscarPerfilPublico(idParam) {
  const id = parseId(idParam);
  const usuario = await prisma.usuario.findUnique({ where: { id } });

  if (!usuario) {
    throw new NotFoundError('usuario não encontrado');
  }

  return perfilPublico(usuario);
}
