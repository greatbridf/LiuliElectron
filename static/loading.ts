'use strict';
import {ipcRenderer as ipc, IpcMessageEvent} from 'electron'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'static/css/loading.css'

ipc.on('loadProgress', function(_: IpcMessageEvent, resp: string) {
  document.getElementById('progressbar_progress')!.style.setProperty('width', `${resp}%`)
})

ipc.on('loadFinished', function() {
  ipc.send('showHomePage')
})
// TODO: current progress bar
