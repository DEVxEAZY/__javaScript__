// --- 1. CRIAR DATAS ---
let agora = new Date(); // Data e hora atual
let dataEspecifica = new Date(2026, 1, 19, 10, 30, 0); // (Ano, Mês (0-11), Dia, Hora, Minuto, Segundo)
let dataString = new Date("2026-02-19T10:30:00"); // Formato ISO

console.log("--- Datas Criadas ---");
console.log("Agora:", agora);
console.log("Específica:", dataEspecifica);

// --- 2. PEGAR PARTES DA DATA (GETTERS) ---
let ano = agora.getFullYear();
let mes = agora.getMonth(); // Janeiro = 0, Fevereiro = 1, etc.
let diaMes = agora.getDate(); // 1 a 31
let diaSemana = agora.getDay(); // 0 (Domingo) a 6 (Sábado)
let horas = agora.getHours();
let minutos = agora.getMinutes();
let segundos = agora.getSeconds();

const mesesNomes = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const diasSemanaNomes = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

console.log("\n--- Partes da Data ---");
console.log(`Hoje é ${diasSemanaNomes[diaSemana]}, ${diaMes} de ${mesesNomes[mes]} de ${ano}`);
console.log(`Horário: ${horas}:${minutos}:${segundos}`);

// --- 3. MANIPULAR DATAS (SETTERS / CÁLCULOS) ---
let dataAmanha = new Date();
dataAmanha.setDate(agora.getDate() + 1); // Adiciona 1 dia

let dataMesPassado = new Date();
dataMesPassado.setMonth(agora.getMonth() - 1); // Subtrai 1 mês

console.log("\n--- Manipulação ---");
console.log("Amanhã será:", dataAmanha.toLocaleDateString('pt-BR'));
console.log("Mês passado foi:", dataMesPassado.toLocaleDateString('pt-BR'));

// --- 4. FORMATAÇÃO ---
console.log("\n--- Formatação ---");
// Formato brasileiro
console.log("PT-BR:", agora.toLocaleDateString('pt-BR')); 
// Formato com hora
console.log("Com hora:", agora.toLocaleString('pt-BR')); 
// Formatação customizada com Intl.DateTimeFormat
const formatador = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
});
console.log("Customizado:", formatador.format(agora));

// --- 5. COMPARAÇÃO DE DATAS ---
console.log("\n--- Comparação ---");
let data1 = new Date(2026, 1, 19);
let data2 = new Date(2026, 1, 20);

if (data1 < data2) {
    console.log("Data 1 é anterior à Data 2");
} else if (data1.getTime() === data2.getTime()) {
    console.log("As datas são iguais");
}
