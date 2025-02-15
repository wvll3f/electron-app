let appStatus = false;

document.getElementById('dot-close-macro').addEventListener('click', () => {
    window.electronAPI.closeAppMacro();
});

const formulario = document.getElementById('meu-formulario');

formulario.addEventListener('submit', function (event) {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const mensagem = document.getElementById('mensagem').value;

    ('Título:', titulo);
    ('Mensagem:', mensagem);
    
    window.electronAPI.sendMessage({ titulo, mensagem });

    document.getElementById('titulo').value = '';
    document.getElementById('mensagem').value = '';

    alert('Formulário enviado com sucesso!');
});

