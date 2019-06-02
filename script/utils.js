import fs from 'fs'

function applyFont(target, path) {
  var targetSafe = JSON.stringify(target).slice(1, -1)
  var data = `
  @font-face {
    font-family: "Source Han Sans SC";
    src: url("${targetSafe}");
  }

  html, body {
    font-family: "Source Han Sans SC";
  }
  `
  fs.writeFileSync(path, data)
  return true
}

export {applyFont}
