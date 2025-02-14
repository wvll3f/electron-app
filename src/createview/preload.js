const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    closeAppMacro: () => ipcRenderer.send('close-app-macro'),
    sendMessage: (dados) => ipcRenderer.send('send-message', dados)
});