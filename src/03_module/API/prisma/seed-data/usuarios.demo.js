/**
 * Usuários fictícios do lab. A senha em texto existe só aqui e na documentação;
 * no banco grava-se apenas senhaHash (bcrypt) via prisma/seed.js.
 */

/** Senha compartilhada para testes locais (mín. 6 caracteres exigidos pela API). */
export const SENHA_PADRAO_LAB = 'escola123';

/** Conta com senha diferente (exemplo de segundo perfil). */
export const SENHA_ADMIN_LAB = 'admin2026';

export const usuariosDemo = [
  {
    email: 'admin@escola.lab',
    senhaPlana: SENHA_ADMIN_LAB,
    perfil: 'Administrador',
  },
  {
    email: 'maria.prof@escola.lab',
    senhaPlana: SENHA_PADRAO_LAB,
    perfil: 'Professora',
  },
  {
    email: 'joao.coord@escola.lab',
    senhaPlana: SENHA_PADRAO_LAB,
    perfil: 'Coordenador',
  },
  {
    email: 'ana.aluna@escola.lab',
    senhaPlana: SENHA_PADRAO_LAB,
    perfil: 'Aluna (conta portal)',
  },
  {
    email: 'bruno.aluno@escola.lab',
    senhaPlana: SENHA_PADRAO_LAB,
    perfil: 'Aluno (conta portal)',
  },
  {
    email: 'secretaria@escola.lab',
    senhaPlana: SENHA_PADRAO_LAB,
    perfil: 'Secretaria',
  },
  {
    email: 'suporte@escola.lab',
    senhaPlana: SENHA_PADRAO_LAB,
    perfil: 'Suporte técnico',
  },
  {
    email: 'visitante@escola.lab',
    senhaPlana: SENHA_PADRAO_LAB,
    perfil: 'Conta demo / visitante',
  },
];
