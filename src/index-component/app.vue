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
import * as utils from 'src/article_util'
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
      head: -1,
      action_disabled: true,
    }
  },
  methods: {
    switch_current(index: number):void{
      if (this.head === index) return
      this.head = index
      this.article = this.articles[index]
      this.article.id = this.get_article_id(this.article.link)
      this.iframe_src = this.get_article_link(this.article.link)
    },
    apply_data(data: LiuliData, replace?: boolean): void {
      console.log(replace)
      if (typeof(replace) === 'boolean' && replace) {
        this.articles = data.articles as Article[]
      } else {
        this.articles = this.articles.concat(data.articles as Article[])
      }
      this.action_disabled = false
      this.switch_current(this.head === -1 ? 0 : this.head)
    },
    load_more(replace?: boolean):void{
      fetch(`${config.cdn_addr}/liuli/articles?page=${this.page++}`)
      .then((resp)=>resp.json())
      .then((json: LiuliResponse)=> {
        this.apply_data(json.data as LiuliData, replace)
        if (this.page === 2) {
          utils.save_liuli_data(json.data as LiuliData)
        }
      })
    },
    update_cache():void {
      var data = utils.load_liuli_data()
      if (data) {
        this.apply_data(data)
      }
      this.load_more(true)
    },
    get_article_id,
    get_article_link,
  },
  mounted() {
    this.$on('update_cache', this.update_cache)
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
