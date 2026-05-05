function adicionarTarefa() {
    const inputTarefa = document.getElementById('input-tarefa');
    const tarefa = inputTarefa.value;
    if (tarefa.trim() !== '') {
        const listaTarefas = document.getElementById('lista-tarefas');
        const li = document.createElement('li');
        li.textContent = tarefa;
        listaTarefas.appendChild(li);
    }
}