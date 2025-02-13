let appStatus = false;

document.getElementById('dot-close').addEventListener('click', () => {
    console.log('oi')
    window.electronAPI.closeApp();
});
document.getElementById('dot-minimize').addEventListener('click', () => {
    window.electronAPI.minimizeApp();
});
document.getElementById('dot-fixed').addEventListener('click', () => {
    appStatus = !appStatus
    console.log(appStatus)
    window.electronAPI.fixedApp(appStatus);
});

document.getElementById('create-macro').addEventListener('click', () => {
    window.electronAPI.newMacrowindow();
});

async function loadMacros() {
    try {
        const macros = await window.electronAPI.getMacros();
        console.log(macros)
        macros.forEach(macro => addMacroToList(macro));
    } catch (error) {
        console.error('Erro ao carregar macros:', error);
    }
}

function addMacroToList(macro) {
    const macroList = document.getElementById('content-macro');
    const li = document.createElement('li')
    const h2 = document.createElement('h2')
    const i = document.createElement('i');
    i.classList.add('fa-regular')
    i.classList.add('fa-clipboard')
    h2.classList.add('title-content');
    h2.textContent = macro.title;
    li.classList.add('content-macro-item');
    li.id =macro.id;
    li.appendChild(h2);
    li.appendChild(i);
    macroList.appendChild(li);
}

loadMacros();

// const macroList = document.getElementById('content-macro');
// const li = document.createElement('li').classList('content-macro-item');
// const h2 = document.createElement('h2').classList('title-content');
// const i = document.createElement('i').classList('fa-regular fa-clipboard');
// li.textContent = `${macro.title}: ${macro.message} (${macro.createdAt})`;
// li.appendChild(h2);
// l1.appendChild(i);
// macroList.appendChild(li);


