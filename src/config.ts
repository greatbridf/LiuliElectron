import * as electron from 'electron'
import * as path from 'path'

var app: Electron.App
var currProcess: NodeJS.Process
if (electron.app) {
  app = electron.app
  currProcess = process
} else {
  app = electron.remote.app
  currProcess = electron.remote.process
}

class Config {
  cdn_addr: string = 'https://interface.greatbridf.top'
  userData: string = app.getPath('userData')
  fontPath: string = path.join(this.userData, 'SourceHanSansSC-Regular.otf')
  fontCssPath: string = path.join(this.userData, 'font.css')
  debug: boolean = (currProcess.argv.indexOf("--debug") !== -1 || currProcess.argv.indexOf("-d") !== -1)
  platform: string = currProcess.platform
}

export default Config