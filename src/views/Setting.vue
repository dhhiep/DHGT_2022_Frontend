<template>
  <div id="settings">
    <div class="panel">
      <div class="heading">Actions</div>
      <div class="content">
        <div class="row">
          <button class="reset-counter" @click="reset">Reset Counter</button>
        </div>
        <div class="row">
          <div class="title">Increase Counter Online (in 10 seconds):</div>
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
          <div class="title">Increase Counter Offline (in 10 seconds):</div>
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
    </div>
    <div class="panel">
      <div class="heading">Settings</div>
      <div class="content">
        <div class="row">
          <div id="setting-form">
            <div class="form-group">
              <label for="max-counter">Max Counter</label>
              <input type="number" id="max-counter" name="maxCounter" v-model="formData.maxCounter" />
            </div>
            <div class="form-group text-right">
              <button @click="submitSettings">Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import * as BroadcastChannel from '@/utils/broadcast_channel';

export default {
  data() {
    return {
      passphrase: '',
      increaseTimes: [10, 50, 100],
      formData: {
        maxCounter: 0,
      },
    };
  },
  created() {
    setTimeout(() => {
      this.formData.maxCounter = this.maxCounter;
    }, 100);
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
    submitSettings() {
      this.$swal
        .fire({
          title: 'Are you sure?',
          text: 'Do you want to update?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
        })
        .then((result) => {
          if (result.isConfirmed) {
            const settings = {
              maxCounter: Number(this.formData.maxCounter),
            };

            console.log(settings);
            this.updateSettings(settings).then(() => {
              this.$swal.fire('Success', 'Your settings was updated', 'success');
            });
          }
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
          confirmButtonText: 'Yes',
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
    ...mapActions('flippedImage', ['resetFlippedImageData', 'reloadFlippedImageData', 'increaseCounter']),
    ...mapActions('setting', ['increaseCounterOnline', 'resetCounter', 'updateSettings']),
  },
  computed: {
    ...mapGetters('setting', ['maxCounter']),
  },
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Alegreya:wght@500;600;800&display=swap');

#settings {
  font-family: 'Alegreya', serif;
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  padding: 20px;
  button {
    cursor: pointer;
    padding: 8px 15px;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    font-size: 18px;
    background-color: rgb(25, 135, 84);
    color: #fff;
    margin: 10px;
    font-family: 'Alegreya', serif;
    &.reset-counter {
      background-color: #dc3545;
    }
    &.increase-counter-offline {
      background-color: #6c757d;
    }
  }
  .panel {
    width: 100%;
    margin-bottom: 15px;
    .heading {
      background-color: #e2d7d7;
      padding: 10px;
      font-size: 18px;
      border-radius: 5px 5px 0 0;
      color: #403939;
      border: 1px solid #e2d7d7;
      border-bottom: none;
    }
    .content {
      padding: 10px;
      border-radius: 0 0 5px 5px;
      border: 1px solid #e2d7d7;
      .row {
        flex-direction: row;
        margin-bottom: 10px;
        &.links {
          margin-bottom: 40px;
          width: 100%;
          a {
            margin: 10px;
            text-decoration: none;
            font-size: 18px;
          }
        }
        .title {
          padding: 0 10px;
          font-weight: 15px;
        }

        .form-group {
          display: flex;
          align-items: center;
          &.text-right {
            justify-content: flex-end;
          }
          label {
            margin: 0 10px;
          }
          input {
            padding: 10px;
            border: 1px solid #e2d7d7;
          }
        }
      }
    }
  }
}
</style>
