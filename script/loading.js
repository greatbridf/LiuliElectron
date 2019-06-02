'use strict';
import {ipcRenderer as ipc} from 'electron'

ipc.on('loadProgress', function(_, resp) {
  document.getElementById('progressbar_progress').style.setProperty('width', `${resp}%`)
})

ipc.on('loadFinished', function() {
  ipc.send('showHomePage')
})
// TODO: current progress bar
