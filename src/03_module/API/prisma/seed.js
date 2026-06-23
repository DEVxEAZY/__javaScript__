import 'dotenv/config';
import prisma from '../database/prisma.js';
import { hashSenha } from '../utils/password.js';
import { alunos } from './seed-data/alunos.js';
import {
  SENHA_ADMIN_LAB,
  SENHA_PADRAO_LAB,
  usuariosDemo,
} from './seed-data/usuarios.demo.js';

async function seedAlunos() {
  const existentes = await prisma.aluno.count();
  if (existentes > 0) {
    await prisma.aluno.deleteMany();
    console.log(`Alunos: removidos ${existentes} registro(s) antigo(s).`);
  }

  const { count } = await prisma.aluno.createMany({ data: alunos });
  console.log(`Alunos: ${count} inseridos.`);
}

async function seedUsuarios() {
  const existentes = await prisma.usuario.count();
  if (existentes > 0) {
    await prisma.usuario.deleteMany();
    console.log(`Usuários: removidos ${existentes} registro(s) antigo(s).`);
  }

  for (const demo of usuariosDemo) {
    const email = demo.email.trim().toLowerCase();
    const senhaHash = await hashSenha(demo.senhaPlana);
    await prisma.usuario.create({
      data: { email, senhaHash },
    });
  }

  console.log(`Usuários: ${usuariosDemo.length} inseridos (senhaHash bcrypt).`);
  console.log('');
  console.log('--- Credenciais do lab (apenas desenvolvimento) ---');
  console.log(`Senha padrão (maioria): ${SENHA_PADRAO_LAB}`);
  console.log(`Senha admin:            ${SENHA_ADMIN_LAB}`);
  console.log('');
  for (const u of usuariosDemo) {
    const senha =
      u.senhaPlana === SENHA_ADMIN_LAB ? SENHA_ADMIN_LAB : SENHA_PADRAO_LAB;
    console.log(`  ${u.email.padEnd(28)}  ${senha.padEnd(12)}  (${u.perfil})`);
  }
  console.log('--- A API nunca devolve senha nem senhaHash ---');
}

async function main() {
  await seedAlunos();
  await seedUsuarios();
  console.log('');
  console.log('Seed concluído.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
