'use strict'

import fs from 'fs';
import path from 'path';
import {ipcMain, app, BrowserWindow, Menu, MenuItem, Tray, globalShortcut} from 'electron';
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
  tray = new Tray(path.resolve(__dirname, './images/trayTemplate.png'));
  tray.setToolTip('Fusen');
  tray.setContextMenu(buildTrayContextMenu());
}

function createFusen(data = null) {
  if (data !== null) {
    const target = BrowserWindow.getAllWindows().find(win => {
      return data.title === win.webContents.getTitle();
    });
    if (target) {
      target.focus();
      return;
    }
  }

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
  createMenu();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

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

function createMenu() {
  const template = [
    {
      label: 'Edit',
      submenu: [
        {
          role: 'undo'
        },
        {
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          role: 'cut'
        },
        {
          role: 'copy'
        },
        {
          role: 'paste'
        },
        {
          role: 'pasteandmatchstyle'
        },
        {
          role: 'delete'
        },
        {
          role: 'selectall'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          role: 'reload'
        },
        {
          role: 'forcereload'
        },
        {
          role: 'toggledevtools'
        },
        {
          type: 'separator'
        },
        {
          role: 'resetzoom'
        },
        {
          role: 'zoomin'
        },
        {
          role: 'zoomout'
        },
        {
          type: 'separator'
        },
        {
          role: 'togglefullscreen'
        }
      ]
    },
    {
      role: 'window',
      submenu: [
        {
          role: 'minimize'
        },
        {
          role: 'close'
        }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () { require('electron').shell.openExternal('http://electron.atom.io') }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          role: 'hide'
        },
        {
          role: 'hideothers'
        },
        {
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          role: 'quit'
        }
      ]
    })
    // Edit menu.
    template[1].submenu.push(
      {
        type: 'separator'
      },
      {
        label: 'Speech',
        submenu: [
          {
            role: 'startspeaking'
          },
          {
            role: 'stopspeaking'
          }
        ]
      }
    )
    // Window menu.
    template[3].submenu = [
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      },
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: 'Zoom',
        role: 'zoom'
      },
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        role: 'front'
      }
    ]
  };

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
