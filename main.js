'use strict';
const {app, BrowserWindow, clipboard, Menu} = require('electron');
const ipc = require('electron').ipcMain;
const request = require('request');

var debug = false;
if (process.argv.indexOf("--debug") !== -1 || process.argv.indexOf("-d") !== -1)
  debug = true;

let window;
const template = [
  {
    label: app.getName(),
	submenu: [
	  { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
	]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' },
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [
          { role: 'startspeaking' },
          { role: 'stopspeaking' }
        ]
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    role: 'window',
    submenu: [
	  { role: 'close' },
	  { role: 'minimize' },
	  { role: 'zoom' },
	  { type: 'separator' },
	  { role: 'front' }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('https://github.com/greatbridf/LiuliElectron') }
      }
    ]
  }
]
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

function createWindow() {
  window = new BrowserWindow({width: 1280, height: 720});
  window.loadFile('index.html');
}

app.on('ready', createWindow);
app.on('window-all-closed', ()=> {
  app.quit()
})

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
