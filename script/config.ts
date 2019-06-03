import {app} from 'electron'
import * as path from 'path'

class Config {
  cdn_addr: string = 'https://interface.greatbridf.top'
  userData: string = app.getPath('userData')
  fontPath: string = path.join(this.userData, 'SourceHanSansSC-Regular.otf')
}

export default Config