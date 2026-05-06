/* ============================================================
   public/js/app.js

   Outro arquivo estatico. Roda no NAVEGADOR (nao no Node!).
   Por isso aqui voce usa "document", "window", fetch, etc. —
   o ambiente e o do browser, nao o do servidor.
   ============================================================ */

document.getElementById("ola").addEventListener("click", async () => {
    // Demonstra que o app estatico ainda pode falar com a rota
    // dinamica do mesmo servidor — convivem no mesmo dominio.
    const resp = await fetch("/api/agora");
    const dados = await resp.json();

    document.getElementById("msg").textContent =
        "Resposta da API: " + dados.agora;
});
