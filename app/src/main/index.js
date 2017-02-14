'use strict'

import fs from 'fs';
import path from 'path';
import {ipcMain, app, BrowserWindow, Menu, MenuItem, Tray, globalShortcut} from 'electron';
import menubar from 'menubar';
import glob from 'glob';

const appDir = path.join(app.getPath('home'), '.fusen');
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`

let tray;

function buildTrayContextMenu() {
  const files = glob.sync(path.join(appDir, '*.json')) || [];
  const sorted = files
    .map(file => {
      const stat = fs.statSync(file);
      return {file, stat};
    })
    .sort((a, b) => {
      return Date.parse(b.stat.mtime)- Date.parse(a.stat.mtime);
    })
    .map(data => data.file);

  return Menu.buildFromTemplate([
    {
      label: 'New Fusen',
      accelerator: 'Command+Alt+F',
      click() {
        createFusen();
      }
    },
    {
      label: 'Fusens',
      submenu: sorted.map((file, idx) => {
        const jsonStr = fs.readFileSync(file, 'utf-8');
        const data = JSON.parse(jsonStr);

        return {
          label: data.title,
          submenu: [
            {
              label: 'Open',
              click() {
                createFusen(data);
              }
            },
            {
              label: 'Delete',
              click() {
                fs.unlinkSync(file);
                tray.setContextMenu(buildTrayContextMenu());
              }
            }
          ]
        };
      })
    }
  ]);
}

try {
  fs.accessSync(appDir, fs.constants.F_OK);
} catch (err) {
  fs.mkdirSync(appDir);
}

function createTray() {
  tray = new Tray(path.resolve(__dirname, '../../icons/tray.png'));
  tray.setToolTip('Fusen');
  tray.setContextMenu(buildTrayContextMenu());
}

function createFusen(data = null) {
  let win = new BrowserWindow({
    height: 200,
    width: 324,
    x: 15,
    y: 30,
    alwaysOnTop: true,
    titleBarStyle: 'hidden-inset'
  });
  win.loadURL(winURL);
  if (data) {
    ipcMain.on('initData', e => {
      e.sender.send('initData:res', data);
    });
  }
  win.on('closed', () => {
    win = null
  });
}

app.on('ready', () => {
  globalShortcut.register('Command+Alt+F', () => {
    createFusen();
  });
  createTray();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
});

ipcMain.on('delete-file', (e, name) => {
  const filename = path.join(appDir, `${name}.json`);
  try {
    fs.accessSync(filename, fs.constants.F_OK);
    fs.unlinkSync(filename);
  } catch (err) {}

  e.sender.send('delete-file:complete');
});

ipcMain.on('save', (e, data) => {
  const filename = path.join(appDir, `${data.title}.json`);

  try {
    if (data.titleUpdate) {
      fs.accessSync(filename, fs.constants.F_OK);
      e.sender.send('save:error:exists', {
        message: 'Title already there'
      });
      return;
    }
  } catch (err) {
  }

  fs.writeFile(filename, JSON.stringify(data), 'utf-8', err => {
    if (err !== null) {
      e.sender.send('save:error', err);
    }
    tray.setContextMenu(buildTrayContextMenu());
    e.sender.send('save:complete');
  });
});
