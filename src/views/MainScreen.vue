<template>
  <div class="screen">
    <div class="left-side">
      <div id="counter">100</div>
      <img id="qr_code" src="@/assets/images/screen/qrcode.png" alt="" />
    </div>
    <div class="right-side">
      <FlippedImage ref="mainFlippedImage" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import hotkeys from 'hotkeys-js';
import FlippedImage from '@/components/screen/FlippedImage.vue';

export default {
  components: {
    FlippedImage,
  },
  created() {
    const self = this;
    this.establish_ws_broadcast_channel();

    hotkeys('right', function (event) {
      event.preventDefault();
      self.openFullscreen();
      self.$refs.mainFlippedImage.showCell();
    });
  },
  methods: {
    openFullscreen() {
      const elem = document.documentElement;

      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
      }
    },
    establish_ws_broadcast_channel() {
      const self = this;

      console.log('Starting connection to WebSocket Server');
      let socket = new WebSocket('wss://api.carloacutisteam.net/api/websocket/ws');

      socket.onopen = function () {
        console.log('[open] Connection established');
        console.log('Sending to server');
        socket.send('My name is John');
      };

      socket.onmessage = function (event) {
        console.log(`[message] Data received from server: ${event.data}`);
        self.$refs.mainFlippedImage.showCell();
      };

      socket.onclose = function (event) {
        if (event.wasClean) {
          console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
          // e.g. server process killed or network down
          // event.code is usually 1006 in this case
          console.log('[close] Connection died');
        }
      };

      socket.onerror = function (error) {
        console.log(`[error] ${error.message}`);
      };
    },
  },
  computed: {
    ...mapState(['screen']),
  },
};
</script>

<style lang="scss">
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
