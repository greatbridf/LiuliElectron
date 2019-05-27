'use strict';
const {app, BrowserWindow, clipboard, Menu} = require('electron');
const ipc = require('electron').ipcMain;
const fs = require('fs')
const path = require('path')
const https = require('https')
const request = require('request');
const cdn_addr = "https://interface.greatbridf.top";
const os = require('os');
const menuTemplate = require('./script/menu.js').template
const userData = app.getPath('userData')
const fontPath = path.join(userData, 'SourceHanSansSC-Regular.otf')
const utils = require('./script/utils.js')

var debug = (process.argv.indexOf("--debug") !== -1 || process.argv.indexOf("-d") !== -1)

var window;

const menu = Menu.buildFromTemplate(menuTemplate)

function createWindow() {
  window = new BrowserWindow({width: 1280, height: 720});

  if (!fs.existsSync(fontPath)) {
    window.loadFile('loading.html')
    https.request(
    {
      host: 'static.greatbridf.top',
      path: '/fonts/Source%20Han%20Sans/SourceHanSansSC-Regular.otf',
      encoding: null
    },
    function(response) {
      var length = response.headers['content-length']
      var progress = 0
      var stream = fs.createWriteStream(fontPath, {encoding: null})

      response.on('data', function(data) {
        stream.write(data)
        progress += data.length
        window.webContents.send('loadProgress', Math.floor(progress / length * 10000)/100)
      })

      response.on('end', function() {
        stream.end()
        if (utils.applyFont(fontPath, path.join(userData, 'font.css'))) {
          window.webContents.send('loadFinished')
        } else {
          throw "font not applied"
        }
      })

    }
    ).end()
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
    window.loadFile('index_win.html')
  } else {
    Menu.setApplicationMenu(menu)
    window.loadFile('index.html')
  }
}

// Register IPC listeners
ipc.on("articlesQuery", (event, req) => {
  request(`${cdn_addr}/liuli/articles?page=${req}`, (err, _, body) => {
    if (err)
      throw "Error getting articles";
    body = JSON.parse(body)
    if (body.code !== 200) {
      console.log(`[ERROR] ${body.code} ${body.msg}`)
      throw body.msg ? body.msg : "Unexpected error"
    }
    console.log(`[INFO] ${body.code} ${body.msg}`)
    event.sender.send("articlesReply", body.data);
  });
})

ipc.on("magnetQuery", (event, articleID) => {
  request(`${cdn_addr}/liuli/magnet?id=${articleID}`, (err, _, body) => {
    if (err)
      throw "Error getting magnet link";
    body = JSON.parse(body)
    console.log(`[INFO] ${body.code} ${body.msg}`)
    event.sender.send("magnetReply", body);
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
