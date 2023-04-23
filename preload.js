const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    showStatusNotification: (statusInfo) => ipcRenderer.send('status-change-notification', statusInfo),
    saveToFileWithPicker: (fileContent) => ipcRenderer.send('save-to-file-with-picker', fileContent),
    loadFileWithPicker: () => ipcRenderer.send('load-file-with-picker'),
    //Callbacks
    onLoadFileSelected: (callback) => ipcRenderer.on('load-file-selected', (event, data) => callback(data))
})