const app = require('electron').app ? require('electron').app : require('electron').remote.app
import * as path from 'path'

class Config {
  cdn_addr: string = 'https://interface.greatbridf.top'
  userData: string = app.getPath('userData')
  fontPath: string = path.join(this.userData, 'SourceHanSansSC-Regular.otf')
  debug: boolean = (process.argv.indexOf("--debug") !== -1 || process.argv.indexOf("-d") !== -1)
  platform: string = process.platform
}

export default Config