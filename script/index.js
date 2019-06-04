'use strict';
import {ipcRenderer as ipc} from 'electron'
import Vue from 'vue'

import {
  get_article_id as getArticleID,
  get_article_link as getArticleLink
} from './article_util'

import Config from './config'
const config = new Config()

function showSuccess() {
  if (!window.SUCCESS)
    window.SUCCESS = jQuery(".success");
  SUCCESS.fadeIn();
  setInterval(()=>SUCCESS.fadeOut(), 2000);
}

function showFailure() {
  if (!window.FAILURE)
    window.FAILURE = jQuery(".failure");
  FAILURE.fadeIn();
  setInterval(()=>FAILURE.fadeOut(), 2000);
}

var doc_app = new Vue({
  el: "#app",
  data: {
    articles: [],
    article: {
      title: 'Loading...',
      description: 'Loading...',
      img: '',
      link: ''
    },
    magnet_links: null,
    iframe_src: null,
    page: 1,
    head: 0,
    action_disabled: true,
    getting_magnet_link: true,
    magnet_link_error: false
  },
  methods: {
    update_data: i => {
      doc_app.head = i
      doc_app.article = doc_app.articles[i]
      doc_app.getting_magnet_link = true;
      doc_app.magnet_links = null;
      doc_app.magnet_link_error = false
      doc_app.iframe_src = getArticleLink(doc_app.articles[doc_app.head].link);
    },
    load_data: data => {
      if (doc_app.action_disabled) {
        doc_app.articles = data.articles;
        doc_app.action_disabled = false;
        doc_app.update_data(0);
      } else
        doc_app.articles = doc_app.articles.concat(data.articles);
    },
    item_click: event => {
      let text = event.target.innerText;
      doc_app.articles.forEach((elem, index) => {
        if (text === elem.title)
          doc_app.update_data(index);
      });
    },
    load_more: _ => {
      ipc.once("articlesReply", (_, resp) => {
        doc_app.load_data(resp);
      });
      ipc.send("articlesQuery", doc_app.page++);
    },
    get_magnet: _ => {
      if (doc_app.magnet_links) return;
      ipc.once("magnetReply", (_, resp) => {
        if (resp.code !== 200) {
          showFailure();
          doc_app.getting_magnet_link = false;
          doc_app.magnet_link_error = true;
          return;
        }
        doc_app.magnet_links = resp.data.magnets;
        doc_app.getting_magnet_link = false;
      });
      ipc.send("magnetQuery", getArticleID(doc_app.article.link));
    },
    copy_to_clipboard: event => {
      ipc.send("setClipboard", event.target.innerText);
      showSuccess();
    }
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
elem.href = config.fontPath
elem.rel = 'stylesheet'
document.head.appendChild(elem)
if (!config.debug) {
  doc_app.load_more()
}