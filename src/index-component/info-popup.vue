<template>
  <transition name="fade">
    <div class="info-popup" v-show="visible">
      <img
      :src="image"
      class="info-popup-image"
      >
      <span class="info-popup-text">
        {{name}}
      </span>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: ['name'],
  data() {
    return {
      image: `images/${this.name}.svg`,
      visible: false,
    }
  },
  mounted() {
    this.$on('show', () => {
      this.visible = true
      window.setTimeout(()=>{
        this.visible = false
      }, 1000)
    })
  }
})
</script>

<style>
.info-popup {
  position: fixed;
  margin: auto;
  background: #fffc;
  top: 40%;
  left: 50%;
  width: 100px;
  height: 100px;
  text-align: center;
  border-radius: 10px;
  padding-bottom: 5px;
  z-index: 100000;
}

.info-popup-image {
  width: 75%;
  height: 75%;
  padding: 5px 5px 0 5px;
}

.info-popup-text {
  text-transform: capitalize;
}

/* transition animation */

.fade-enter-active, .fade-leave-active {
  transition: opacity 250ms;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
