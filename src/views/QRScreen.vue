<template>
  <div class="screen">
    <div class="left-side">
      <div id="counter">{{ currentCounter }}</div>
      <img id="qr_code" src="@/assets/images/screen/qrcode.png" alt="" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import hotkeys from 'hotkeys-js';
import { openFullscreen } from '@/utils/browser';
import * as BroadcastChannel from '@/utils/broadcast_channel';

export default {
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

    BroadcastChannel.onMessage('resetCounter', () => {
      this.resetFlippedImageData();
    });

    BroadcastChannel.onMessage('counterUpdated', () => {
      this.reloadFlippedImageData();
    });

    this.establish_ws_broadcast_channel();
  },
  methods: {
    establish_ws_broadcast_channel() {
      console.log('Starting connection to WebSocket Server');

      const self = this;
      let socket = new WebSocket(process.env.VUE_APP_BACKEND_WS_URL);

      socket.onopen = function () {
        console.log('[open] Connection established');
        socket.send('#status');
      };

      socket.onmessage = function (event) {
        const data = JSON.parse(event.data.replace('Data: ', ''));

        console.log('onMessage', data);
        self.setFlippedImageData(data);
      };

      socket.onclose = function (event) {
        if (event.wasClean) {
          console.log(`[onclose] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
          console.log('[onclose] Connection died');
        }

        console.log('[onclose] Trying to re-connect');
        self.establish_ws_broadcast_channel();
      };

      socket.onerror = function (error) {
        console.log(`[error] ${error.message}`);
      };
    },
    ...mapActions('flippedImage', ['setFlippedImageData', 'resetFlippedImageData', 'reloadFlippedImageData']),
  },
  computed: {
    ...mapState(['screen']),
    ...mapGetters('flippedImage', ['currentCounter']),
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
    height: 500px;
    flex-direction: column;
    justify-content: space-between;
    #counter {
      font-size: 130px;
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
