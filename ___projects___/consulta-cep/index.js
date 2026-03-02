
const displayCepElements = {
    cep: document.getElementById("res-cep"),
    logradouro: document.getElementById("res-logradouro"),
    complemento: document.getElementById("res-complemento"),
    unidade: document.getElementById("res-unidade"),
    bairro: document.getElementById("res-bairro"),
    localidade: document.getElementById("res-localidade"),
    uf: document.getElementById("res-uf"),
    estado: document.getElementById("res-estado"),
    regiao: document.getElementById("res-regiao"),
    ibge: document.getElementById("res-ibge"),
    gia: document.getElementById("res-gia"),
    ddd: document.getElementById("res-ddd"),
    siafi: document.getElementById("res-siafi")
};

const statusConsulta = document.getElementById("status_consulta");

// Função para simular o efeito de digitação
async function typeWriter(element, text, speed = 10) {
    if (!text) {
        element.innerHTML = "-";
        return;
    }
    
    element.innerHTML = "";
    for (let i = 0; i < text.length; i++) {
        element.innerHTML += text.charAt(i);
    }
}

// Limpa todos os campos de resultado
function clearResults() {
    Object.values(displayCepElements).forEach(el => el.innerHTML = "");
    statusConsulta.innerHTML = "";
}

async function getCep() {
    const inputField = document.getElementById("cep-input");
    const cep = inputField.value.trim().replace(/\D/g, ""); // Apenas números
    
    if (cep.length !== 8) {
        statusConsulta.innerHTML = "❌ Formato de CEP inválido. Use 8 dígitos.";
        statusConsulta.style.color = "#ff4444";
        return;
    }

    clearResults();
    statusConsulta.innerHTML = "Buscando dados no servidor";
    statusConsulta.classList.add("loading");
    statusConsulta.style.color = "#00ff00";

    const url = `https://viacep.com.br/ws/${cep}/json/`;

    try {
        const response = await fetch(url);
        
        // Simular um pequeno delay para mostrar o carregamento
        await new Promise(resolve => setTimeout(resolve, 800));

        const data = await response.json();
        
        statusConsulta.classList.remove("loading");

        if (data.erro) {
            statusConsulta.innerHTML = "❌ CEP não encontrado.";
            statusConsulta.style.color = "#ff4444";
            return;
        }

        statusConsulta.innerHTML = "✅ Dados recuperados com sucesso!";

        // Preenchimento progressivo (em cascata)
        const entries = Object.entries(displayCepElements);
        for (const [key, element] of entries) {
            const value = data[key];
            await typeWriter(element, value);
        }

        console.log("Consulta finalizada:", data);
        return data;
    } catch (error) {
        statusConsulta.classList.remove("loading");
        statusConsulta.innerHTML = "❌ Erro na conexão com o servidor.";
        statusConsulta.style.color = "#ff4444";
        console.error('Ocorreu um erro na busca do CEP:', error);
    }
}
