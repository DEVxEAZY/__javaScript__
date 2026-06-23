/**
 * controllers/postsController.js
 *
 * Posts aninhados em /usuarios/:userId/posts — req.params.userId
 * vem do prefixo montado no server.js (mergeParams: true no router).
 */

const postsPorUsuario = {
  1: [
    { id: 101, titulo: "Primeiro post da Ana", userId: 1 },
    { id: 102, titulo: "Express Router", userId: 1 },
  ],
  2: [{ id: 201, titulo: "Hello do Bruno", userId: 2 }],
};

function listarPorUsuario(req, res) {
  const userId = Number(req.params.userId);
  const posts = postsPorUsuario[userId] || [];
  res.json({ userId, posts });
}

module.exports = { listarPorUsuario };
