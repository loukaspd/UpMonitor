const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    showStatusNotification: (statusInfo) => ipcRenderer.send('status-change-notification', statusInfo)
})