import prisma from '../database/prisma.js';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../errors/domainErrors.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SEXOS_VALIDOS = new Set(['M', 'F']);
const IDADE_MIN = 5;
const IDADE_MAX = 120;
const PESO_MIN = 20;
const PESO_MAX = 300;
const ALTURA_MIN = 0.5;
const ALTURA_MAX = 2.5;

function parseId(idParam) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id < 1) {
    throw new ValidationError('id inválido');
  }
  return id;
}

function textoObrigatorio(valor, campo) {
  const t = typeof valor === 'string' ? valor.trim() : '';
  if (!t) {
    throw new ValidationError(`${campo} é obrigatório`);
  }
  return t;
}

function validarPayload(body) {
  const nome = textoObrigatorio(body?.nome, 'nome');
  const sobrenome = textoObrigatorio(body?.sobrenome, 'sobrenome');
  const email = textoObrigatorio(body?.email, 'email').toLowerCase();

  if (!EMAIL_REGEX.test(email)) {
    throw new ValidationError('email inválido');
  }

  const sexo = textoObrigatorio(body?.sexo, 'sexo').toUpperCase();
  if (!SEXOS_VALIDOS.has(sexo)) {
    throw new ValidationError('sexo deve ser "M" ou "F"');
  }

  const idade = Number(body?.idade);
  if (!Number.isInteger(idade) || idade < IDADE_MIN || idade > IDADE_MAX) {
    throw new ValidationError(
      `idade deve ser um inteiro entre ${IDADE_MIN} e ${IDADE_MAX}`,
    );
  }

  const peso = Number(body?.peso);
  if (!Number.isFinite(peso) || peso < PESO_MIN || peso > PESO_MAX) {
    throw new ValidationError(
      `peso deve ser um número entre ${PESO_MIN} e ${PESO_MAX} (kg)`,
    );
  }

  const altura = Number(body?.altura);
  if (!Number.isFinite(altura) || altura < ALTURA_MIN || altura > ALTURA_MAX) {
    throw new ValidationError(
      `altura deve ser um número entre ${ALTURA_MIN} e ${ALTURA_MAX} (metros)`,
    );
  }

  return { nome, sobrenome, email, sexo, idade, peso, altura };
}

export async function criar(body) {
  const data = validarPayload(body ?? {});

  try {
    return await prisma.aluno.create({ data });
  } catch (err) {
    if (err.code === 'P2002') {
      throw new ConflictError('email já cadastrado');
    }
    throw err;
  }
}

export async function listar() {
  return prisma.aluno.findMany({
    orderBy: { id: 'asc' },
  });
}

export async function buscarPorId(idParam) {
  const id = parseId(idParam);
  const aluno = await prisma.aluno.findUnique({ where: { id } });

  if (!aluno) {
    throw new NotFoundError('aluno não encontrado');
  }

  return aluno;
}
