// eslint-disable-next-line import/no-extraneous-dependencies
const { app, BrowserWindow, ipcMain } = require('electron');
const { is } = require('electron-util');
const TrayGenerator = require('./TrayGenerator');
const path = require('path');
const Store = require('electron-store');

const schema = {
  launchAtStart: true
}
const store = new Store(schema);
let Tray = null;

const createMainWindow = () => {
  const mainWindow = new BrowserWindow({
    backgroundColor: '#fff',
    icon: __dirname + `/assets/Icon.icns`,
    width: 800,
    height: 450,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    webPreferences: {
      devTools: is.development,
      nodeIntegration: true,
      backgroundThrottling: false,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });

  mainWindow.webContents.on('new-window', function (e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });


  if (is.development) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
    mainWindow.loadURL('http://localhost:3030');
  } else {
    mainWindow.loadURL(`file://${path.join(__dirname, '../../build/index.html')}`);
  }

  return mainWindow
};

app.on('ready', () => {
  app.dock.hide();
  app.setLoginItemSettings({
    openAtLogin: store.get('launchAtStart'),
  });
  Tray = new TrayGenerator(createMainWindow(), store);
  Tray.createTray();
  ipcMain.on('UPDATE_TITLE', (event, data) => {
    Tray.setTitle(data)
  });
});
