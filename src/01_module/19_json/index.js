// A palavra-chave "async" indica que esta função é assíncrona.
// Isso significa que ela sempre retornará uma Promise (promessa de um valor futuro).
async function getCep(cep) {
    // Definimos a URL da API do ViaCEP usando Template Strings para injetar o CEP.
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    // O bloco "try/catch" é usado para lidar com erros de forma segura em funções assíncronas.
    try {
        // "await" pausa a execução da função até que a Promise do fetch seja resolvida.
        // O fetch faz a requisição HTTP para a URL fornecida.
        const response = await fetch(url);

        // "await" aqui espera a conversão da resposta bruta em um objeto JSON utilizável.
        // O método .json() também retorna uma Promise.
        const data = await response.json();

        // Retornamos os dados obtidos. Como a função é "async", este retorno será
        // "empacotado" dentro de uma Promise resolvida.
        return data;
    } catch (error) {
        // Se ocorrer qualquer erro durante o fetch ou a conversão para JSON (ex: sem internet),
        // o código pula diretamente para este bloco catch.
        console.error('Ocorreu um erro na busca do CEP:', error);
    }
}

// --- FORMAS DE CONSUMIR A FUNÇÃO ASSÍNCRONA ---

// Opção A: Usando .then()
// Como getCep() retorna uma Promise, usamos .then() para definir o que acontece
// quando a promessa for cumprida (resolvida com sucesso).
getCep('12040590').then(data => {
    // O parâmetro 'data' recebe o valor retornado pela função lá no return (linha 18).
    console.log("Resultado via .then():", data);
});

// Opção B: Usando async/await fora da função (Top-Level Await)
// Note: Esta forma só funciona em ambientes modernos (como as versões recentes do Node.js
// ou dentro de módulos <script type="module"> no navegador).
/*
try {
    const data = await getCep('12040590');
    console.log("Resultado via await direto:", data);
} catch (e) {
    console.error(e);
}
*/
