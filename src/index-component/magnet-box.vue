<template>
  <div class="modal fade" id="magnet">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <!-- Information popup -->
          <info-popup name="success" ref="success"></info-popup>
          <info-popup name="failure" ref="failure"></info-popup>

          <h4 class="modal-title">选择磁力链接...</h4>
          <button class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="list-group">
            <a
              href="javascript:;"
              @click="copy_to_clipboard"
              class="list-group-item"
              v-for="magnet in magnet_links"
              :key="magnet.id"
            >{{magnet}}</a>
          </div>
        </div>
        <div class="modal-footer">
          <span class="text-muted small" v-if="!finished">正在获取中</span>
          <span class="text-muted small" v-if="err">获取磁力链接失败</span>
          <button class="btn btn-danger" data-dismiss="modal">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Config from 'src/config'
import InfoPopup from 'src/index-component/info-popup.vue'
import { ipcRenderer } from 'electron';
const config = new Config()

export default Vue.extend({
  props: ['cid'],
  watch: {
    cid: {
      handler(value) {
        this.err = false
        this.finished = false

        fetch(`${config.cdn_addr}/liuli/magnet?id=${value}`)
          .then(resp => {
            return resp.json()
          })
          .then(json => {
            this.finished = true
            this.magnet_links = json.data.magnets
          })
          .catch(() => {
            this.err = true
            this.finished = true
            ;(this.$refs.failure as Vue).$emit('show')
          })
      },
      deep: true,
    }
  },
  data() {
    return {
      err: false,
      finished: false,
      magnet_links: [],
    }
  },
  methods: {
    copy_to_clipboard(event: any) {
      ipcRenderer.send('setClipboard', event.target.innerText)
      ;(this.$refs.success as Vue).$emit('show')
    }
  },
  components: {
    'info-popup': InfoPopup,
  }
})
</script>