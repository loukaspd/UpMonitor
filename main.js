// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Notification, Tray, Menu, dialog } = require('electron');
const {autoUpdater} = require('electron-updater');
const path = require('path');
const serve = require('electron-serve');
const loadURL = serve({ directory: 'public' });
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

//Custom_Code: <Limit-to-single-instance>
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
    return;
}

//Custom_Code: </Limit-to-single-instance>

function isDev() {
    return !app.isPackaged;
}

function createWindow() {    
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 650,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
            // enableRemoteModule: true,
            // contextIsolation: false
            webSecurity: false,
        },
        icon: path.join(__dirname, 'public/favicon.png'),
        show: false
    });

    mainWindow.setTitle(`${app.getName()}-${app.getVersion()}`);

    // This block of code is intended for development purpose only.
    // Delete this entire block of code when you are ready to package the application.
    if (isDev()) {
        mainWindow.loadURL('http://localhost:8080/');
    } else {
        loadURL(mainWindow);
    }
    
    // Uncomment the following line of code when app is ready to be packaged.
    // loadURL(mainWindow);

    // Open the DevTools and also disable Electron Security Warning.
    // process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;
    // mainWindow.webContents.openDevTools();

    //########## <LOUKAS - Minimize-to-Tray>
    mainWindow.on('minimize',function(event){
        event.preventDefault();
        mainWindow.hide();
    });

    var tray = new Tray(path.join(__dirname, 'public/favicon.png'));

    tray.addListener('double-click', (e,b) => {mainWindow.show()});

    tray.setContextMenu(Menu.buildFromTemplate([
        {
          label: 'Show App', click: function () {
            
          }
        },
        {
          label: 'Quit', click: function () {
            isQuiting = true;
            app.quit();
          }
        }
      ]));

    //########## </LOUKAS - Minimize-to-Tray>

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });

    // Emitted when the window is ready to be shown
    // This helps in showing the window gracefully.
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    });

    //Custom_Code: open links with default browser
    //needs target="_blank" in order to work
    mainWindow.webContents.on('new-window', function(e, url) {
      e.preventDefault();
      require('electron').shell.openExternal(url);
    });

    //Custom_Code: Show notification
    ipcMain.on('status-change-notification', (event, statusInfo) => {
        new Notification({ 
            title: statusInfo.description
            , body: `Status changed from ${statusInfo.prevStatus} to ${statusInfo.currentStatus}`
        })
        .show()
    })

    //Custom_Code: Save file with Dialog picker
    ipcMain.on('save-to-file-with-picker', (event, fileContent) => {
        const filePath = dialog.showSaveDialogSync(mainWindow, {
            title: 'save endpoints',
            properties: ['openFile', 'promptToCreate']
        });
        if (!filePath) {
            return;
        }

        fs.writeFile(filePath, fileContent, function (err) {
            if (err) throw err;
        });
    })

    //Custom_Code: Load File with picker
    ipcMain.on('load-file-with-picker', (event) => {
        let filePath = dialog.showOpenDialogSync(mainWindow, {
            title: 'load endpoints',
            properties: ['openFile']
        });
        if (!filePath || !filePath.length) {
            return;
        }
        filePath = filePath[0];

        const fileContent = fs.readFileSync(filePath, 'utf8');
        mainWindow.webContents.send('load-file-selected', {filePath, fileContent});
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow();
    autoUpdater.checkForUpdatesAndNotify();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
});

//Custom_Code: Limit to single instance
app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    }
})