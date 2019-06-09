<template>
  <div class="container-fluid">
    <div class="row">
      <!-- Main nav bar -->
      <div class="col-sm-4 hacg-block">
        <div class="list-group">
          <a
            href="javascript:;"
            class="list-group-item list-group-item-action"
            :class="{ active: head === key }"
            @click="switch_current(key)"
            v-for="(item, key) of articles"
            :key="key"
          >{{item.title}}</a>
          <a
            href="javascript:;"
            class="list-group-item list-group-item-action"
            @click="load_more"
          >More...</a>
        </div>
      </div>
      <!-- End -->

      <!-- Article area -->
      <div class="col-sm-8 hacg-block">
        <div class="card">
          <img :src="article.img" class="card-img-top">
          <div class="card-body">
            <h4 class="card-title">{{article.title}}</h4>
            <p class="card-text">{{article.description}}</p>
            <button
              :disabled="action_disabled"
              class="btn btn-info"
              data-toggle="modal"
              data-target="#magnet"
            >获取磁力链接</button>
            <button
              :disabled="action_disabled"
              class="btn btn-primary right"
              data-toggle="modal"
              data-target="#article"
            >进入文章页面</button>
          </div>
        </div>
      </div>
      <!-- End -->

      <!-- Article explorer -->
      <div class="modal fade" id="article">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-body">
              <iframe :src="get_article_link(article.link)" frameborder="0"></iframe>
            </div>
          </div>
        </div>
      </div>
      <!-- End -->

      <div id="information_wrap">
        <!-- Magnet link selector -->
        <magnet-box :cid="article.id"></magnet-box>
        <!-- End -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MagnetBox from 'src/index-component/magnet-box.vue'

import Config from 'src/config'
import { Article, get_article_id, get_article_link } from '../article_util';
import { LiuliData, LiuliResponse } from 'src/liuli'

const config = new Config()

export default Vue.extend({
  data() {
    return {
      articles: [] as Article[],
      article: {
        description: 'Loading',
        title: 'Loading',
        link: '',
        img: '',
        id: '',
      } as Article,
      iframe_src: '',
      page: 1,
      head: 0,
      action_disabled: true,
    }
  },
  methods: {
    switch_current(index: number):void{
      this.head = index
      this.article = this.articles[index]
      this.article.id = this.get_article_id(this.article.link)
      this.iframe_src = this.get_article_link(this.article.link)
    },
    apply_data(data: LiuliData): void {
      if (this.action_disabled) {
        this.articles = data.articles as Article[]
        this.action_disabled = false
        this.switch_current(0)
      } else {
        this.articles = this.articles.concat(data.articles as Article[])
      }
    },
    load_more():void{
      fetch(`${config.cdn_addr}/liuli/articles?page=${this.page++}`)
      .then((resp)=>resp.json())
      .then((json: LiuliResponse)=> {
        this.apply_data(json.data as LiuliData)
        return ''
      })
    },
    get_article_id,
    get_article_link,
  },
  mounted() {
    this.$on('update_cache', this.load_more)
  },
  components: {
    'magnet-box': MagnetBox,
  },
})
</script>

<style>
.right {
  float: right;
}

.hacg-block {
  height: 100vh;
  overflow-y: scroll;
}

iframe {
  width: 100%;
  height: 80vh;
}
</style>
