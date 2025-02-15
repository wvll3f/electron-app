let appStatus = false;

document.getElementById('dot-close').addEventListener('click', () => {
    ('oi')
    window.electronAPI.closeApp();
});
document.getElementById('dot-minimize').addEventListener('click', () => {
    window.electronAPI.minimizeApp();
});
document.getElementById('dot-fixed').addEventListener('click', () => {
    appStatus = !appStatus
    (appStatus)
    window.electronAPI.fixedApp(appStatus);
});
document.getElementById('create-macro').addEventListener('click', () => {
    window.electronAPI.newMacrowindow();
});

async function loadMacros() {
    try {
        const macros = await window.electronAPI.getMacros();
        (macros)
        macros.forEach(macro => addMacroToList(macro));
    } catch (error) {
        console.error('Erro ao carregar macros:', error);
    }
}

function addMacroToList(macro) {
    const macroList = document.getElementById('content-macro');
    const li = document.createElement('li')
    const h3 = document.createElement('h3')
    const iClip = document.createElement('i');
    const iTrash = document.createElement('i');
    const div = document.createElement('div');
    div.classList.add('actions');
    iTrash.classList.add('far');
    iTrash.classList.add('fa-trash-alt')
    iClip.classList.add('fa-regular')
    iClip.classList.add('fa-clipboard')
    h3.classList.add('title-content');
    h3.textContent = macro.title;
    li.classList.add('content-macro-item');
    li.id = macro.id;
    iTrash.id = macro.id;
    iClip.id = macro.id;
    div.appendChild(iClip);
    div.appendChild(iTrash);
    li.appendChild(h3);
    li.appendChild(div);
    macroList.appendChild(li);
}

loadMacros();

function mappingItems() {
    const itemsList = document.querySelectorAll('.content-macro-item').forEach((item) => {
        item.addEventListener('click', () => {
            let id = item.id
            window.electronAPI.selectedMacrowindow(id)
        })
    })
    const iconsTrash = document.querySelectorAll('.fa-trash-alt').forEach((item) => {
        item.addEventListener('click', () => {
            let id = item.id
            window.electronAPI.deleteMacro(id)
        })
    })
}

setTimeout(mappingItems, 1000)

// const macroList = document.getElementById('content-macro');
// const li = document.createElement('li').classList('content-macro-item');
// const h2 = document.createElement('h2').classList('title-content');
// const i = document.createElement('i').classList('fa-regular fa-clipboard');
// li.textContent = `${macro.title}: ${macro.message} (${macro.createdAt})`;
// li.appendChild(h2);
// l1.appendChild(i);
// macroList.appendChild(li);


