const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    closeApp: () => ipcRenderer.send('close-app'),
    minimizeApp: () => ipcRenderer.send('minimize-app'),
    fixedApp: (appStatus) => ipcRenderer.send('fixed-app', appStatus),
    addMacro: (title, message) => ipcRenderer.invoke('add-macro', { title, message }),
    getMacros: () => ipcRenderer.invoke('get-macros'),
    newMacrowindow: () => ipcRenderer.send('new-macro-window'),
    selectedMacrowindow: id => ipcRenderer.send('selected-macro-window', id),
    deleteMacro: id => ipcRenderer.send('delete-selected-macro', id),
});