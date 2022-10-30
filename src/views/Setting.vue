<template>
  <div id="settings">
    <div class="row">
      <button class="reset-counter" @click="reset">Reset Counter</button>
    </div>
    <div class="row">
      <button class="increase-counter-online" @click="triggerIncreaseCounterOnline">Increase Counter (Online)</button>
      <button class="increase-counter-offline" @click="triggerIncreaseCounterOffline">
        Increase Counter (Offline)
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
    };
  },
  mounted() {},
  methods: {
    triggerIncreaseCounterOnline() {
      this.increaseCounterOnline().then((resp) => {
        console.log(resp.data.data);
      });
    },
    triggerIncreaseCounterOffline() {
      this.reloadFlippedImageData();
      this.increaseCounter().then(() => {
        BroadcastChannel.sendMessage({ type: 'counterUpdated' });
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
  align-items: center;
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
  }
}
</style>
