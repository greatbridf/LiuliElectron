'use strict';
const ipc = require('electron').ipcRenderer

ipc.on('loadProgress', function(_, resp) {
  document.getElementById('progressbar_progress').style.setProperty('width', `${resp}%`)
})

ipc.on('loadFinished', function() {
  window.location = 'index.html'
})
// TODO: current progress bar
