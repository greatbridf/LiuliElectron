'use strict';
const {app, BrowserWindow, clipboard} = require('electron');
const ipc = require('electron').ipcMain;
const request = require('request');

var debug = false;
if (process.argv.indexOf("--debug") !== -1 || process.argv.indexOf("-d") !== -1)
  debug = true;

let window;

function createWindow() {
  window = new BrowserWindow({width: 1280, height: 720});
  window.loadFile('index.html');
}

app.on('ready', createWindow);

// Register IPC listeners
ipc.on("articlesQuery", (event, req) => {
  request(`http://144.202.106.87/interface/LiuliGo.cgi?req=articles&page=${req}`, (err, _, body) => {
    if (err)
      throw "Error getting articles";
    console.log(body);
    event.sender.send("articlesReply", JSON.parse(body));
  });
})

ipc.on("magnetQuery", (event, articleID) => {
  request(`http://144.202.106.87/interface/LiuliGo.cgi?req=magnet&id=${articleID}`, (err, _, body) => {
    if (err)
      throw "Error getting magnet link";
    event.sender.send("magnetReply", body);
  })
})

ipc.on("setClipboard", (_, content) => {
  clipboard.writeText(content);
});

ipc.on("debugStatusQuery", (event, _) => {
  event.sender.send("debugStatusReply", debug);
})
