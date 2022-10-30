<template>
  <div class="screen">
    <div class="left-side">
      <div id="counter">{{ currentCounter }}</div>
      <img id="qr_code" src="@/assets/images/screen/qrcode.png" alt="" />
    </div>
    <div class="right-side">
      <FlippedImage ref="subFlippedImage" />
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
      console.log(event);
      event.preventDefault();
      openFullscreen();

      if (event.key == 'ArrowRight') {
        self.increaseCounter().then(() => {
          BroadcastChannel.sendMessage({ type: 'increaseCounter' });
        });
      }
    });
  },
  methods: {
    ...mapActions('flippedImage', ['increaseCounter']),
  },
  computed: {
    ...mapState(['screen']),
    ...mapGetters('flippedImage', ['currentCounter', 'currentOpenPieces']),
  },
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@900&display=swap');

.screen {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .left-side {
    display: flex;
    height: 600px;
    flex-direction: column;
    justify-content: space-between;
    margin-right: 50px;
    #counter {
      font-size: 140px;
      font-family: 'Roboto', sans-serif;
      text-align: center;
      height: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    #qr_code {
      width: 300px;
      max-width: 100%;
    }
  }
  .right-side {
  }
}
</style>
