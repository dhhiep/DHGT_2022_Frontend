<template>
  <div class="screen">
    <div class="row">
      <div class="left-side">
        <div id="counter">{{ currentCounter }}</div>
        <img id="qr_code" src="@/assets/images/screen/qrcode.png" alt="" />
      </div>
      <div class="center-side">
        <FlippedImage ref="mainFlippedImage" :width="screenHeight" />
      </div>
      <div class="right-side">
        <div id="counter">{{ currentCounter }}</div>
        <img id="qr_code" src="@/assets/images/screen/qrcode.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import JQuery from 'jquery';
import hotkeys from 'hotkeys-js';
import { openFullscreen } from '@/utils/browser';
import * as BroadcastChannel from '@/utils/broadcast_channel';
import FlippedImage from '@/components/screen/FlippedImage.vue';

export default {
  data() {
    return {
      aspectRatio: 4 / 3,
    };
  },
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

    console.log(this.screenHeight);
  },
  methods: {
    ...mapActions('flippedImage', ['increaseCounter']),
  },
  computed: {
    screenHeight() {
      const width = JQuery(window).width() - 800;

      return width / this.aspectRatio;
    },
    ...mapState(['screen']),
    ...mapGetters('flippedImage', ['currentCounter', 'currentOpenPieces']),
  },
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@900&display=swap');

.screen {
  // height: 100vh;
  width: 100%;
  display: flex;
  .row {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 20px;
    width: 100%;
    // height: 600px;
  }
  .left-side,
  .right-side {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
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
  .center-side {
    margin: 0 50px;
  }
}
</style>
