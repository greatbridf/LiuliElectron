'use strict';
const ipc = require("electron").ipcRenderer;

function getArticleID(link) {
  let regexp = /wp\/([0-9]*)\.html/;
  return regexp.exec(link)[1];
}

function getArticleLink(link) {
  return `http://144.202.106.87/interface/LiuliGo.cgi?req=content&id=${getArticleID(link)}`;
}

var doc_app = new Vue({
  el: "#app",
  data: {
    articles: [{title: "Loading..."}],
    title: "Loading...", 
    description: "Loading...",
    img: "",
    link: "",
    iframe_src: null,
    page: 1
  },
  methods: {
    update_data: i => {
      let article = doc_app.articles[i];
      for (let key in article)
        doc_app[key] = article[key];
      let on = document.querySelector('.article-list-item-on');
      if (on)
        on.classList.remove('article-list-item-on');
      document.querySelectorAll('.article-list-item')[i].classList.add('article-list-item-on');
    },
    load_data: data => {
      let me = doc_app;
      if (me.articles[0].title === "Loading...") {
        me.articles = data.articles;
        me.update_data(0);
      } else
        me.articles = me.articles.concat(data.articles);
    },
    item_click: event => {
      let text = event.target.innerText;
      doc_app.articles.forEach((elem, index) => {
        if (text === elem.title)
          doc_app.update_data(index);
      });
    },
    open_article: event => {
      doc_app.iframe_src = getArticleLink(doc_app.link);
    },
    back_to_list: _ => {
      doc_app.iframe_src = null;
    },
    load_more: _ => {
      ipc.once("articlesReply", (_, resp) => {
        doc_app.load_data(resp);
      });
      ipc.send("articlesQuery", doc_app.page++);
    }
  }
});

doc_app.load_more();
