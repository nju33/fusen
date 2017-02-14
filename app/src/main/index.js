'use strict'

import path from 'path';
import {app, BrowserWindow, Menu, Tray} from 'electron';
import menubar from 'menubar';

let mainWindow;
let tray;

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`

//   mainWindow.loadURL(winURL)
//
//   mainWindow.on('closed', () => {
//     mainWindow = null
//   })
//
//   // eslint-disable-next-line no-console
//   console.log('mainWindow opened')
// }
//
// app.on('ready', createWindow)

function createTray() {
  tray = new Tray(path.resolve(__dirname, '../../icons/tray.png'));
  tray.setToolTip('Fusen');
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'New Fusen',
      click() {
        console.log('todo');
        let win = new BrowserWindow({
          height: 200,
          width: 300,
          x: 15,
          y: 15,
          alwaysOnTop: true,
          titleBarStyle: 'hidden-inset'
        });
        win.loadURL(`${winURL}`);
        win.on('closed', () => {
          win = null
        })
      }
    }
  ]))
}

app.on('ready', createTray);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
