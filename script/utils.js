const fs = require('fs')

function applyFont(target, path) {
  var data = `
  @font-face {
    font-family: "Source Han Sans SC";
    src: url("${target}");
  }

  html, body {
    font-family: "Source Han Sans SC";
  }
  `
  fs.writeFileSync(path, data)
  return true
}

module.exports = {
  applyFont
}
