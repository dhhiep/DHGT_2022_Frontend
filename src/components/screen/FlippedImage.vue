<template>
  <div id="main-view" :style="mainViewStyles">
    <div id="canvas" :style="mainImageStyles" v-show="!isPiecesOpened"></div>
    <div id="video" v-if="isPiecesOpened">
      <video :style="mainVideoStyles">
        <source :src="videoUrl" type="video/mp4" />
      </video>
    </div>
  </div>
</template>

<script>
import JQuery from 'jquery';
import { mapActions, mapGetters } from 'vuex';
import { assetPath, resize } from '@/helpers/image';
import * as BroadcastChannel from '@/utils/broadcast_channel';

export default {
  data() {
    return {
      cells: [],
      col: 10,
      row: 10,
      aspectRatio: 4 / 3,
      imageUrl: '',
      mainImagePath: 'screen/main.jpg',
      videoUrl: 'https://dhgt2022-frontend-app.s3.ap-southeast-1.amazonaws.com/welcome2.mp4',
      isVideoPlayed: false,
    };
  },
  props: {
    height: {
      type: Number,
      default: 600,
    },
  },
  created() {
    this.establish_ws_broadcast_channel();
    this.playVideo();

    BroadcastChannel.onMessage('resetCounter', () => {
      this.resetFlippedImageData();
      this.showCells();
      this.resetCells();
    });

    BroadcastChannel.onMessage('counterUpdated', () => {
      this.reloadFlippedImageData();
      this.showCells({ animation: true });
    });

    resize(assetPath(this.mainImagePath), this.width, this.height).then((dataUrl) => {
      this.imageUrl = dataUrl;
      setTimeout(() => {
        this.process();
        this.showCells();
        JQuery('#canvas').css('opacity', 1);
      }, 500);

      JQuery('#canvas').attr('style', this.mainImageStyles);
    });
  },
  computed: {
    width() {
      return this.height * this.aspectRatio;
    },
    mainViewStyles() {
      const styles = [`width: ${this.width}px`, `height: ${this.height}px`];
      return styles.join(';');
    },
    mainVideoStyles() {
      const styles = [`width: ${this.width}px`, `height: ${this.height}px`];
      return styles.join(';');
    },
    mainImageStyles() {
      const styles = [`width: ${this.width}px`, `height: ${this.height}px`, `background-image: url(${this.imageUrl})`];
      return styles.join(';');
    },
    isPiecesOpened() {
      const totalPieces = this.col * this.row;
      return this.currentOpenPieces >= totalPieces;
    },
    ...mapGetters('flippedImage', ['currentOpenPieces']),
  },
  methods: {
    resetCells() {
      this.isVideoPlayed = false;
      JQuery('.cell').addClass('hidden').removeClass('animate__animated animate__bounceInDown');
    },
    showCells(options = {}) {
      [...Array(this.currentOpenPieces || 0).keys()].forEach((cellIndex) => {
        const cell = JQuery(`.cell.cell-${cellIndex}.hidden`);
        cell.removeClass('hidden');

        if (options.animation) {
          cell.addClass('animate__animated animate__bounceInDown');
        }
      });
    },
    playVideo() {
      setInterval(() => {
        const video = JQuery('video').get(0);
        if (!this.isPiecesOpened || this.isVideoPlayed || !video) return;

        video
          .play()
          .then(() => (this.isVideoPlayed = true))
          .catch(() => console.log("Can't play video"));
      }, 2000);
    },
    process() {
      const canvas = JQuery('#canvas');
      const backgroundImage = canvas.css('background-image');

      // remove the background from canvas
      canvas.css('background-image', 'none');

      // number of columns and rows
      let totalPieceIndexes = this.col * this.row - 1;

      const colWidth = canvas.width() / this.col;
      const rowHeight = canvas.height() / this.row;

      for (let i = 0; i < this.row; i++) {
        for (let j = 0; j < this.col; j++) {
          const cellTop = i * rowHeight + 'px';
          const cellLeft = j * colWidth + 'px';
          const cellBackgroundPosition = -(j * colWidth) + 'px ' + -(i * rowHeight) + 'px';
          const cellElement = `
            <div class='cell cell-${totalPieceIndexes--} hidden'>
              <div class='back'></div>
              <div class='front'></div>
            </div>
            `;

          const cell = JQuery(cellElement).width(colWidth).height(rowHeight).appendTo(canvas);
          cell.css('top', cellTop);
          cell.css('left', cellLeft);
          cell.find('.front').css('background', backgroundImage).css('background-position', cellBackgroundPosition);

          this.cells.push(cell);
        }
      }
    },
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
        self.showCells({ animation: true });
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
    ...mapActions('flippedImage', ['reloadFlippedImageData', 'resetFlippedImageData', 'setFlippedImageData']),
  },
};
</script>

<style lang="scss">
#main-view {
  position: relative;
  #video {
    position: absolute;
    top: 0;
    left: 0;
  }
}

#canvas {
  background-repeat: round;
  position: relative;
  opacity: 0;
}
.cell {
  position: absolute;
  > .front {
    opacity: 1;
  }
  &:not(.hidden) {
    > .back {
      z-index: 0;
      display: none;
    }
  }
  > .back {
    position: absolute;
    text-align: center;
    font-size: 30px;
    color: red;
    left: 0;
    top: 0;
    transition: all 1s;
    z-index: 1;
    &:before {
      content: '';
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }
  }
  > * {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }
}
.cell.hidden {
  > .front {
    opacity: 0;
  }
}
.back {
  background: white;
}
</style>
