// eslint-disable-next-line import/no-extraneous-dependencies
const { app, BrowserWindow } = require('electron');
const { is } = require('electron-util');

const path = require('path');

const createMainWindow = () => {
  const mainWindow = new BrowserWindow({
    backgroundColor: '#fff',
    width: 800,
    height: 450,
    webPreferences: {
      devTools: is.development,
      nodeIntegration: true,
      backgroundThrottling: false,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });

  if (is.development) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
    mainWindow.webContents.on('new-window', function (e, url) {
      e.preventDefault();
      require('electron').shell.openExternal(url);
    });
    mainWindow.loadURL('http://localhost:3030');
  } else {
    mainWindow.loadURL(`file://${path.join(__dirname, '../../build/index.html')}`);
  }
};

app.on('ready', () => {
  createMainWindow();
});
