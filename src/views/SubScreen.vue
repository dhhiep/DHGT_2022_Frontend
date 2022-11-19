<template>
  <div class="screen">
    <div class="row">
      <div class="left-side">
        <img id="light" src="@/assets/images/screen/light.png" alt="" />
        <div id="content-wrapper" :style="leftSideContentWrapperStyles">
          <div id="counter">
            <div id="dynamic-island"></div>
            <div id="text">
              {{ currentCounter }}
            </div>
          </div>
          <img id="qr_code" src="@/assets/images/screen/qr_code_with_border.png" alt="" />
        </div>
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
        self.triggerIncreaseCounterOffline(20);
      }
    });
  },
  methods: {
    getRandomInt(max) {
      return Math.floor(Math.random() * max);
    },
    triggerIncreaseCounterOffline(times) {
      this.reloadFlippedImageData();

      Array.from({ length: times }, () => {
        setTimeout(() => {
          this.increaseCounter().then(() => {
            BroadcastChannel.sendMessage({ type: 'counterUpdated' });
          });
        }, this.getRandomInt(10000 + times * 100));
      });
    },
    ...mapActions('flippedImage', ['increaseCounter', 'reloadFlippedImageData']),
  },
  computed: {
    leftSideContentWrapperStyles() {
      const styles = [`height: ${this.height}px`];
      return styles.join(';');
    },
    height() {
      return Number(this.$route.query.height || 600);
    },
    ...mapState(['screen']),
    ...mapGetters('flippedImage', ['currentCounter', 'currentOpenPieces']),
  },
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@900&display=swap');
@import '../assets/stylesheets/media_queries.scss';

.screen {
  width: 100%;
  display: flex;
  height: 100vh;
  background-image: url('../assets/images/screen/background.jpg');
  background-position: center;
  background-size: contain;
  overflow: hidden;
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
    justify-content: center;
    height: 100%;
    position: relative;
    @include responsiveFrom(medium) {
      margin-right: 30px;
    }
    #light {
      position: absolute;
      top: -200px;
      left: -135px;
      width: 190%;
      @include responsiveFrom(w1024) {
        top: -133px;
        left: -85px;
      }
      @include responsiveFrom(xxlarge) {
        width: 250%;
        left: -165px;
      }
    }
    #content-wrapper {
      padding-top: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      #counter {
        font-family: 'Roboto', sans-serif;
        color: #7f1b18;
        text-align: center;
        background-color: #ebdfc9;
        border: 10px solid #f8c543;
        position: relative;
        font-size: 60px;
        padding: 10px 20px;
        @include responsiveFrom(medium) {
          padding: 20px;
        }
        @include responsiveFrom(large) {
          font-size: 85px;
        }
        &:before {
          content: '';
          position: absolute;
          top: -15px;
          left: -15px;
          bottom: -15px;
          right: -15px;
          border: 5px #030200 solid;
          border-radius: 5px;
        }
        &:after {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          bottom: -3px;
          right: -3px;
          border: 5px #030200 solid;
        }
        #dynamic-island {
          height: 8px;
          width: 55px;
          background-color: #000;
          margin: auto;
          border-radius: 5px;
        }
        #text {
          margin-top: 15px;
          min-width: 120px;
          @include responsiveFrom(large) {
            min-width: 175px;
          }
        }
      }
      #qr_code {
        width: 85%;
        max-width: 200px;
        z-index: 1;
      }
    }
  }
  .right-side {
    margin-left: 30px;
    z-index: 1;
  }
}
</style>
