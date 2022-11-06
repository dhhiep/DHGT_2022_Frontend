<template>
  <div class="screen">
    <FlippedImage />
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
}
</style>
