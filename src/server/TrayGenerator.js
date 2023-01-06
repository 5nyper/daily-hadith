const { Tray, Menu, ipcMain } = require('electron');
const path = require('path');

class TrayGenerator {
    constructor(mainWindow, store) {
        this.tray = null;
        this.store = store;
        this.mainWindow = mainWindow;
    }
    getWindowPosition = () => {
        const windowBounds = this.mainWindow.getBounds();
        const trayBounds = this.tray.getBounds();
        const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
        const y = Math.round(trayBounds.y + trayBounds.height);
        return { x, y };
    };

    showWindow = () => {
        const position = this.getWindowPosition();
        this.mainWindow.setPosition(position.x, position.y, false);
        this.mainWindow.show();
        this.mainWindow.setVisibleOnAllWorkspaces(true);
        this.mainWindow.focus();
        this.mainWindow.setVisibleOnAllWorkspaces(false);
    };

    toggleWindow = () => {
        if (this.mainWindow.isVisible()) {
            this.mainWindow.hide();
        } else {
            this.showWindow();
        }
    };

    rightClickMenu = () => {
        const menu = [
            {
                label: 'Launch at startup',
                type: 'checkbox',
                checked: this.store.get('launchAtStart'),
                click: event => this.store.set('launchAtStart', event.checked),
            },
            {
                label: 'Refresh Hadith',
                click: event => this.mainWindow.webContents.send('REFRESH', 'hello renderer')

            },
            {
                role: 'quit',
                accelerator: 'Command+Q'
            }
        ];
        this.tray.popUpContextMenu(Menu.buildFromTemplate(menu));
    }

    createTray = () => {
        this.tray = new Tray(path.join(__dirname, './assets/IconTemplate.png'));
        console.log(path.join(__dirname, './assets/IconTemplate.png'))
        this.tray.setIgnoreDoubleClickEvents(true);

        this.tray.on('click', this.toggleWindow);
        this.tray.on('right-click', this.rightClickMenu);

    };

    setTitle = (title) => {
        this.tray.setTitle(title)
    }
}

module.exports = TrayGenerator;
