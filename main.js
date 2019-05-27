'use strict';
const {app, BrowserWindow, clipboard, Menu} = require('electron');
const ipc = require('electron').ipcMain;
const request = require('request');
const cdn_addr = "https://interface.greatbridf.top";
const os = require('os');
const menuTemplate = require('./script/menu.js').template

var debug = (process.argv.indexOf("--debug") !== -1 || process.argv.indexOf("-d") !== -1)

var window;

const menu = Menu.buildFromTemplate(menuTemplate)
if (process.platform === "win32") {
  Menu.setApplicationMenu(null)
} else {
  Menu.setApplicationMenu(menu)
}

function createWindow() {
  window = new BrowserWindow({width: 1280, height: 720});
  if (process.platform === "win32") {
    window.loadFile('index_win.html')
  } else {
    window.loadFile('index.html')
  }
}

app.on('ready', createWindow);
app.on('window-all-closed', ()=> {
  app.quit()
})

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
