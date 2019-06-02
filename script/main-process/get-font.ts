import * as https from 'https'
import * as fs from 'fs'

class DownloadFont {
  private path: string
  private onfinish: ()=>void
  private onprogress: (progress: number)=>void

  constructor(path: string) {
    this.path = path
    return this
  }

  progress(callback: (progress: number)=>void): DownloadFont {
    this.onprogress = callback
    return this
  }

  finish(callback: ()=>void): DownloadFont {
    this.onfinish = callback
    return this
  }

  download(): void {
    https.request(
      {
        host: 'static.greatbridf.top',
        path: '/fonts/Source%20Han%20Sans/SourceHanSansSC-Regular.otf',
      },
      (response) => {
        var length: number = parseInt(response.headers['content-length'])
        var progress: number = 0
        var stream = fs.createWriteStream(this.path, {encoding: null})

        response.on('data', (data) => {
          stream.write(data)
          progress += data.length
          this.onprogress(Math.floor(Math.floor(progress / length * 10000)/100))
        })

        response.on('end', () => {
          stream.end()
          this.onfinish()
        })
      }
    ).end()
  }
}

export {DownloadFont}