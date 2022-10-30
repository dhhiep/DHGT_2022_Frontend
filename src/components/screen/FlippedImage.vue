<template>
  <div id="canvas"></div>
</template>

<script>
import JQuery from 'jquery';
import { mapActions, mapGetters } from 'vuex';
import * as BroadcastChannel from '@/utils/broadcast_channel';

export default {
  data() {
    return {
      cells: [],
    };
  },
  created() {
    this.establish_ws_broadcast_channel();

    setTimeout(() => {
      this.process();
      this.showCells();
      JQuery('#canvas').css('opacity', 1);
    }, 1000);

    BroadcastChannel.onMessage('increaseCounter', () => {
      this.reloadFlippedImageData();
      this.showCells();
    });
  },
  methods: {
    showCells() {
      [...Array(this.currentOpenPieces || 0).keys()].forEach((cellIndex) => {
        const cell = JQuery(`.cell.cell-${cellIndex}.flipped`);
        cell.removeClass('flipped');
      });
    },
    showCell() {
      console.log('show', this.cells.length);
      if (this.cells.length <= 0) return;

      const cell = this.cells.pop();
      JQuery(cell).removeClass('flipped');
    },
    process() {
      const canvas = JQuery('#canvas');
      const backgroundImage = canvas.css('background-image');

      // remove the background from canvas
      canvas.css('background-image', 'none');

      // number of columns and rows
      const col = 10;
      const row = 10;
      let totalPieceIndexes = col * row - 1;

      const colWidth = canvas.width() / col;
      const rowHeight = canvas.height() / row;

      for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
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
    ...mapActions('flippedImage', ['reloadFlippedImageData', 'setFlippedImageData']),
  },
  computed: {
    ...mapGetters('flippedImage', ['currentOpenPieces']),
  },
};
</script>

<style lang="scss" scoped>
#canvas {
  background: url('../../assets/images/screen/main.jpg');
  width: 800px;
  height: 600px;
  position: relative;
  opacity: 0;
}
.cell {
  position: absolute;
  cursor: pointer;
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
