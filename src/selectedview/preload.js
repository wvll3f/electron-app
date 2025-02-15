const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    closeSelectedMacro: () => ipcRenderer.send('close-selected'),
    onData: (callback) => ipcRenderer.on('detalhes-item', (event, data) => callback(data))
});