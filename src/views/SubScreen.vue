<template>
  <div class="screen">
    <div class="row">
      <div class="left-side">
        <div id="counter">{{ currentCounter }}</div>
        <img id="qr_code" src="@/assets/images/screen/qrcode.png" alt="" />
      </div>
      <div class="right-side">
        <FlippedImage ref="subFlippedImage" :height="height" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import hotkeys from 'hotkeys-js';
import { openFullscreen } from '@/utils/browser';
import * as BroadcastChannel from '@/utils/broadcast_channel';
import FlippedImage from '@/components/screen/FlippedImage.vue';

export default {
  components: {
    FlippedImage,
  },
  created() {
    const self = this;

    hotkeys('right,f', function (event) {
      event.preventDefault();
      openFullscreen();

      if (event.key == 'ArrowRight') {
        self.increaseCounter().then(() => {
          BroadcastChannel.sendMessage({ type: 'counterUpdated' });
        });
      }
    });
  },
  methods: {
    ...mapActions('flippedImage', ['increaseCounter']),
  },
  computed: {
    height() {
      return this.$route.query.height || 600;
    },
    ...mapState(['screen']),
    ...mapGetters('flippedImage', ['currentCounter', 'currentOpenPieces']),
  },
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@900&display=swap');

.screen {
  width: 100%;
  display: flex;
  padding-top: 50px;
  .row {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    width: 100%;
  }
  .left-side {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    margin-right: 30px;
    #counter {
      font-family: 'Roboto', sans-serif;
      font-size: 130px;
      text-align: center;
    }
    #qr_code {
      width: 100%;
      max-width: 100%;
    }
  }
  .right-side {
    margin-left: 30px;
  }
}
</style>
