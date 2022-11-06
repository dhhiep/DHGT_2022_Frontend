<template>
  <div id="main-view" :style="mainViewStyles">
    <div id="canvas" :style="mainImageStyles" v-show="!isPiecesOpened"></div>
    <div id="video" v-if="isPiecesOpened">
      <video :style="mainVideoStyles" autoplay muted>
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
      col: 10,
      row: 10,
      cells: [],
      imageUrl: '',
      videoUrl: 'https://dhgt2022-frontend-app.s3.ap-southeast-1.amazonaws.com/welcome.mp4',
    };
  },
  props: {
    mainImage: {
      type: String,
      default: 'screen/main.png',
    },
    width: {
      type: Number,
      default: 1066,
    },
    height: {
      type: Number,
      default: 600,
    },
  },
  created() {
    this.establish_ws_broadcast_channel();

    BroadcastChannel.onMessage('resetCounter', () => {
      JQuery('.cell').addClass('flipped');
      this.resetFlippedImageData();
      this.showCells();
    });

    BroadcastChannel.onMessage('counterUpdated', () => {
      this.reloadFlippedImageData();
      this.showCells();
    });

    if (this.isPiecesOpened) {
      setTimeout(() => {
        JQuery('video').get(0).play();
      }, 500);
    } else {
      resize(assetPath(this.mainImage), 1066, 600).then((dataUrl) => {
        this.imageUrl = dataUrl;
        setTimeout(() => {
          this.process();
          this.showCells();
          JQuery('#canvas').css('opacity', 1);
        }, 500);

        JQuery('#canvas').attr('style', this.mainImageStyles);
      });
    }
  },
  computed: {
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
    showCells() {
      [...Array(this.currentOpenPieces || 0).keys()].forEach((cellIndex) => {
        const cell = JQuery(`.cell.cell-${cellIndex}.flipped`);
        cell.removeClass('flipped');
      });
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
            <div class='cell cell-${totalPieceIndexes--} flipped'>
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
        self.showCells();
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
    -webkit-transform-style: preserve-3d;
    transition: all 1s;
  }
  &:not(.flipped) {
    > .back {
      -webkit-transform: rotateY(180deg);
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
.cell.flipped {
  > .front {
    -webkit-transform: rotateY(180deg);
  }
}
.back {
  background: white;
}
</style>
