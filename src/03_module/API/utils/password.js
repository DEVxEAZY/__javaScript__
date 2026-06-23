import bcrypt from 'bcrypt';

const ROUNDS = 10;

export async function hashSenha(senha) {
  return bcrypt.hash(senha, ROUNDS);
}
