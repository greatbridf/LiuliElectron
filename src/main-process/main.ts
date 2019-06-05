'use strict';
import {app, BrowserWindow, clipboard, Menu, ipcMain as ipc, IpcMessageEvent} from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import fetch from 'node-fetch'

import menuTemplate from 'src/menu'
import {applyFont} from 'src/utils'
import {DownloadFont} from 'src/main-process/get-font'
import Config from 'src/config'

var config = new Config()

var window: BrowserWindow;

const menu = Menu.buildFromTemplate(menuTemplate)

function createWindow() {
  window = new BrowserWindow({width: 1280, height: 720});

  if (!fs.existsSync(config.fontPath)) {
    window.loadFile('static/loading.html')
    // Download font
    new DownloadFont(config.fontPath)
      .progress(function(progress) {
        window.webContents.send('loadProgress', progress)
      })
      .finish(function() {
        if (applyFont(config.fontPath, path.join(config.userData, 'font.css'))) {
          window.webContents.send('loadFinished')
        } else {
          throw 'font not applied'
        }
      }).download()
  } else {
    showHomePage()
  }
}

app.on('ready', createWindow);
app.on('window-all-closed', ()=> {
  app.quit()
})

function showHomePage() {
  if (process.platform === "win32") {
    Menu.setApplicationMenu(null)
  } else {
    Menu.setApplicationMenu(menu)
  }
  window.loadFile('static/index.html')
}

// Register IPC listeners
ipc.on("articlesQuery", (event: IpcMessageEvent, req: string) => {
  fetch(`${config.cdn_addr}/liuli/articles?page=${req}`)
  .then((resp) => {
    return resp.json()
  })
  .then((json) => {
    event.sender.send('articlesReply', json.data)
  })
})

ipc.on("magnetQuery", (event: IpcMessageEvent, articleID: string) => {
  fetch(`${config.cdn_addr}/liuli/magnet?id=${articleID}`)
  .then((resp) => {
    return resp.json()
  })
  .then((json) => {
    event.sender.send('magnetReply', json)
  })
})

ipc.on("setClipboard", (_: IpcMessageEvent, content: string) => {
  clipboard.writeText(content);
});

ipc.on('fontPathQuery', function(event: IpcMessageEvent) {
  event.sender.send('fontPathReply', path.join(config.userData, 'font.css'))
})

ipc.on('showHomePage', function() {
  showHomePage()
})