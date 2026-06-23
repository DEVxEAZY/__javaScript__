import prisma from '../database/prisma.js';
import { ConflictError, NotFoundError, ValidationError } from "../errors/domainErrors.js";

export async function listar(params={}) {
    const { limit = 10, orderBy = 'id', order = 'asc'} = params;
    return prisma.hobby.findMany({ take: limit, orderBy });
}
export async function buscarPorId(id) {
    return prisma.hobby.findUnique({ where: { id } });
}
export async function criar(hobbyBody) {
    function validarPayload(payload) {
        if (!payload) throw new ValidationError('Nenhum dado de hobby fornecido.');
        const { name, tipo, dificuldade, descricao } = payload;
        if (!name || typeof name !== 'string') throw new ValidationError('Nome do hobby é obrigatório e deve ser uma string.');
        if (!tipo || typeof tipo !== 'string') throw new ValidationError('Tipo do hobby é obrigatório e deve ser uma string.');
        if (!dificuldade || typeof dificuldade !== 'string'){
            if (dificuldade !== 'FACIL' && dificuldade !== 'MEDIA' && dificuldade !== 'DIFICIL') throw new ValidationError('Dificuldade do hobby é obrigatória e deve ser "FACIL", "MEDIA" ou "DIFICIL".');
        }
        if (!descricao || typeof descricao !== 'string') throw new ValidationError('Descrição do hobby é obrigatória e deve ser uma string.');
        return { name, tipo, dificuldade, descricao };
    }

    const { name, tipo, dificuldade, descricao } = validarPayload(hobbyBody);
    return prisma.hobby.create({ data: { name, tipo, dificuldade, descricao } });
}
