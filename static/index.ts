'use strict';
import Vue from 'vue'
import App from 'src/index-component/app.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'static/css/index.css'
import 'bootstrap'

import Config from 'src/config'
const config = new Config()

var doc_app = new Vue({
  el: "#app",
  components: {
    app: App,
  },
  template: '<app ref="app"></app>'
});

// apply windows scrollbar stylesheet
if (config.platform === 'win32') {
  require('static/css/windows.css')
}

// apply font
var elem = document.createElement('link')
elem.href = config.fontCssPath
elem.rel = 'stylesheet'
document.head.appendChild(elem)
if (!config.debug) {
  ;(doc_app.$refs.app as Vue).$emit('update_cache')
}