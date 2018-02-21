const {app, BrowserWindow} = require('electron')
var path = require('path')
let mainWindow = null
const url = require('url');
const { ipcMain } = require('electron');

function createWindow() {
    // Initialize the window to our specified dimensions
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        minWidth: 1281,
        minHeight: 800,
        backgroundColor: '#312450',
        show: true,
        icon: __dirname + 'logo/logoicns'
    })
    
    
    // Specify entry point
    mainWindow.loadURL('http://localhost:3000/#/')

    // Show dev tools
    // Remove this line before distributing
    mainWindow.webContents.openDevTools()

    // Remove window once app is closed
    mainWindow.on('closed', function () {
        mainWindow = null
    })

    mainWindow.webContents.executeJavaScript(`
    var path = require('path');
    module.paths.push(path.resolve('node_modules'));
    module.paths.push(path.resolve('../node_modules'));
    module.paths.push(path.resolve(__dirname, '..', '..', 'electron', 'node_modules'));
    module.paths.push(path.resolve(__dirname, '..', '..', 'electron.asar', 'node_modules'));
    module.paths.push(path.resolve(__dirname, '..', '..', 'app', 'node_modules'));
    module.paths.push(path.resolve(__dirname, '..', '..', 'app.asar', 'node_modules'));
    path = undefined;
    `);
}

app.on('ready', function () {
    createWindow()
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})


