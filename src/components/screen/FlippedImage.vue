<template>
  <div class="canvas"></div>
</template>

<script>
import JQuery from 'jquery';

export default {
  data() {
    return {
      cells: [],
    };
  },
  created() {
    setTimeout(() => {
      this.process();

      JQuery('.canvas').css('opacity', 1);
    }, 1000);
  },
  methods: {
    showCell() {
      console.log('show', this.cells.length);
      if (this.cells.length <= 0) return;

      const cell = this.cells.pop();
      JQuery(cell).toggleClass('flipped');
    },
    process() {
      const canvas = JQuery('div.canvas');
      const backgroundImage = canvas.css('background-image');
      //remove the background from canvas
      canvas.css('background-image', 'none');
      //number of columns and rows
      const col = 10;
      const row = 10;
      const colWidth = canvas.width() / col;
      const rowHeight = canvas.height() / row;

      for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
          const cell = JQuery("<div class='cell flipped'><div class='back'></div><div class='front'></div></div>")
            .width(colWidth)
            .height(rowHeight)
            .appendTo(canvas);

          cell.css('left', j * colWidth + 'px');
          cell.css('top', i * rowHeight + 'px');

          cell
            .find('.front')
            .css('background', backgroundImage)
            .css('background-position', -(j * colWidth) + 'px ' + -(i * rowHeight) + 'px');

          cell.click(function () {
            JQuery(this).toggleClass('flipped');
          });

          this.cells.push(cell);
        }
      }
    },
  },
};
</script>

<style lang="scss">
.canvas {
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
