<template>
  <div id="settings">
    <div class="row links">
      <a href="/screen?height=350" target="_blank">Screen (350px)</a>
      <a href="/screen?height=400" target="_blank">Screen (400px)</a>
      <a href="/screen?height=450" target="_blank">Screen (450px)</a>
      <a href="/screen?height=500" target="_blank">Screen (500px)</a>
      <a href="/screen?height=550" target="_blank">Screen (550px)</a>
      <a href="/screen?height=600" target="_blank">Screen (600px)</a>
      <a href="/screen?height=650" target="_blank">Screen (650px)</a>
      <a href="/screen?height=700" target="_blank">Screen (700px)</a>
      <a href="/screen?height=750" target="_blank">Screen (750px)</a>
    </div>
    <div class="row links">
      <a href="/main-screen" target="_blank">Main Screen</a>
      <a href="/video-screen" target="_blank">Video Screen</a>
      <a href="/qr-screen" target="_blank">QR Screen</a>
    </div>
    <hr />
    <div class="row">
      <button class="reset-counter" @click="reset">Reset Counter</button>
    </div>
    <div class="row">
      <div class="heading">Increase Counter Online (in 10 seconds):</div>
      <button
        class="increase-counter-online"
        @click="triggerIncreaseCounterOnline(times)"
        v-for="(times, index) in increaseTimes"
        :key="index"
      >
        Increase {{ times }} Counter(s)
      </button>
    </div>
    <div class="row">
      <div class="heading">Increase Counter Offline (in 10 seconds):</div>
      <button
        class="increase-counter-offline"
        @click="triggerIncreaseCounterOffline(times)"
        v-for="(times, index) in increaseTimes"
        :key="index"
      >
        Increase {{ times }} Counter(s)
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import * as BroadcastChannel from '@/utils/broadcast_channel';

export default {
  data() {
    return {
      passphrase: '',
      increaseTimes: [10, 50, 100],
    };
  },
  methods: {
    getRandomInt(max) {
      return Math.floor(Math.random() * max);
    },
    triggerIncreaseCounterOnline(times) {
      Array.from({ length: times }, () => {
        setTimeout(() => {
          this.increaseCounterOnline().then((resp) => {
            console.log(resp.data.data);
          });
        }, this.getRandomInt(10000 + times * 100));
      });
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
    reset() {
      this.$swal
        .fire({
          title: 'Are you sure?',
          text: 'Do you want to reset counter?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, reset it!',
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.resetCounter().then(() => {
              this.resetFlippedImageData().then(() => {
                BroadcastChannel.sendMessage({ type: 'resetCounter' });
                this.$swal.fire('Success', 'Your counter was reseted', 'success');
              });
            });
          }
        });
    },
    ...mapActions('flippedImage', ['resetFlippedImageData', 'reloadFlippedImageData']),
    ...mapActions('setting', ['increaseCounterOnline', 'resetCounter']),
    ...mapActions('flippedImage', ['increaseCounter']),
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@900&display=swap');

#settings {
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  button {
    cursor: pointer;
    padding: 8px 15px;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    font-size: 18px;
    background-color: rgb(25, 135, 84);
    color: #fff;
    margin: 10px;

    &.reset-counter {
      background-color: #dc3545;
    }
    &.increase-counter-offline {
      background-color: #6c757d;
    }
  }

  .row {
    flex-direction: row;
    margin-bottom: 10px;
    &.links {
      margin-bottom: 40px;
      width: 100%;
      a {
        font-family: Arial, Helvetica, sans-serif;
        margin: 10px;
        text-decoration: none;
        font-size: 18px;
      }
    }
    .heading {
      padding: 0 10px;
      font-family: arial;
      font-weight: 15px;
    }
  }
}
</style>
