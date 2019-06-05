'use strict';
import {ipcRenderer as ipc} from 'electron'
import Vue from 'vue'
import MagnetBox from 'src/index-component/magnet-box.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'static/css/index.css'
import 'bootstrap'

import {
  get_article_id as getArticleID,
  get_article_link as getArticleLink,
  Article,
} from 'src/article_util'

import Config from 'src/config'
const config = new Config()

var doc_app = new Vue({
  el: "#app",
  data: {
    articles: (():Article[]=>{return []})(),
    article: (():Article=>{return {
      link: '',
      img: '',
      description: 'Loading...',
      title: 'Loading...',
      id: '',
    }})(),
    iframe_src: '',
    page: 1,
    head: 0,
    action_disabled: true,
  },
  methods: {
    update_data(i: number):void {
      this.head = i
      this.article = this.articles[i]
      this.article.id = this.getArticleID(this.article.link)
      this.iframe_src = getArticleLink(this.articles[this.head].link);
    },
    load_data(data: any):void {
      if (this.action_disabled) {
        this.articles = data.articles;
        this.action_disabled = false;
        this.update_data(0);
      } else
        this.articles = this.articles.concat(data.articles);
    },
    item_click(event: any) {
      let text = event.target.innerText;
      this.articles.forEach((elem: any, index) => {
        if (text === elem.title)
          this.update_data(index);
      });
    },
    load_more() {
      fetch(`${config.cdn_addr}/liuli/articles?page=${this.page++}`)
      .then((resp) => {
        return resp.json()
      })
      .then((json) => {
        this.load_data(json.data)
      })
    },
    getArticleID,
  },
  components: {
    'magnet-box': MagnetBox,
  }
});

// apply windows scrollbar stylesheet
if (config.platform === 'win32') {
  var elem = document.createElement('link')
  elem.href = 'style/windows.css'
  elem.rel = 'stylesheet'
  document.head.appendChild(elem)
  jQuery('body').hide(function() {
    jQuery('body').show()
  })
}

// apply font
var elem = document.createElement('link')
elem.href = config.fontCssPath
elem.rel = 'stylesheet'
document.head.appendChild(elem)
if (!config.debug) {
  doc_app.load_more()
}