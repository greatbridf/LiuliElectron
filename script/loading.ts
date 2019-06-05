'use strict';
import {ipcRenderer as ipc, IpcMessageEvent} from 'electron'

ipc.on('loadProgress', function(_: IpcMessageEvent, resp: string) {
  document.getElementById('progressbar_progress')!.style.setProperty('width', `${resp}%`)
})

ipc.on('loadFinished', function() {
  ipc.send('showHomePage')
})
// TODO: current progress bar
