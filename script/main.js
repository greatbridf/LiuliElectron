'use strict';
import {app, BrowserWindow, clipboard, Menu, ipcMain as ipc} from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import fetch from 'node-fetch'

import {template as menuTemplate} from './menu'
import {applyFont} from './utils'
import {DownloadFont} from './main-process/get-font.ts'

const cdn_addr = "https://interface.greatbridf.top";
const userData = app.getPath('userData')
const fontPath = path.join(userData, 'SourceHanSansSC-Regular.otf')

const debug = (process.argv.indexOf("--debug") !== -1 || process.argv.indexOf("-d") !== -1)

var window;

const menu = Menu.buildFromTemplate(menuTemplate)

function createWindow() {
  window = new BrowserWindow({width: 1280, height: 720});

  if (!fs.existsSync(fontPath)) {
    window.loadFile('loading.html')
    // Download font
    new DownloadFont(fontPath)
      .progress(function(progress) {
        window.webContents.send('loadProgress', progress)
      })
      .finish(function() {
        if (applyFont(fontPath, path.join(userData, 'font.css'))) {
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
  window.loadFile('index.html')
}

// Register IPC listeners
ipc.on("articlesQuery", (event, req) => {
  fetch(`${cdn_addr}/liuli/articles?page=${req}`)
  .then((resp) => {
    return resp.json()
  })
  .then((json) => {
    event.sender.send('articlesReply', json.data)
  })
})

ipc.on("magnetQuery", (event, articleID) => {
  fetch(`${cdn_addr}/liuli/magnet?id=${articleID}`)
  .then((resp) => {
    return resp.json()
  })
  .then((json) => {
    event.sender.send('magnetReply', json)
  })
})

ipc.on("setClipboard", (_, content) => {
  clipboard.writeText(content);
});

ipc.on("debugStatusQuery", (event, _) => {
  event.sender.send("debugStatusReply", debug);
});

ipc.on("cdnAddressQuery", (event, _) => {
  event.sender.send("cdnAddressReply", cdn_addr);
});

ipc.on('fontPathQuery', function(event) {
  event.sender.send('fontPathReply', path.join(userData, 'font.css'))
})

ipc.on('showHomePage', function() {
  showHomePage()
})

ipc.on('platformQuery', function(event) {
  event.sender.send('platformReply', process.platform)
})
