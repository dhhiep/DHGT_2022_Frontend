<template>
  <div>
    <div id="page-wrapper">
      <div id="main-view" :style="mainViewStyles">
        <div class="block">
          <div id="heading">
            <div class="heading-1">HÀNH TRÌNH KHÁM PHÁ</div>
            <div class="heading-2">ĐIỀU CON LÃNG QUÊN</div>
          </div>
          <div id="counter">{{ welcome.currentAsset.count_user_scan }}</div>
          <div id="main-content">
            <div class="content">
              {{ welcome.currentAsset.wish_content }}
            </div>
            <div id="jesus_signature">Jesus.</div>
          </div>
        </div>
        <div id="footer">
          <div id="message">Chia sẻ QR Code này cho những bạn xung quanh nhé</div>
          <img id="qr_code" src="@/assets/images/screen/qrcode.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {};
  },
  created() {
    this.fetchAsset();
  },
  computed: {
    mainViewStyles() {
      const styles = [
        `width: ${this.width}px`,
        `height: ${this.height}px`,
        `background-image: url('${this.welcome.currentAsset.imageUrl}')`,
      ];

      return styles.join(';');
    },
    ...mapState(['welcome']),
  },
  methods: {
    getImageSize() {
      return new Promise((resolve) => {
        var img = new Image();
        img.onload = function () {
          const data = {
            width: this.width,
            height: this.height,
          };
          resolve(data);
        };

        img.src = this.welcome.currentAsset;
      });
    },
    ...mapActions('welcome', ['fetchAsset']),
  },
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap');

#page-wrapper {
  font-family: 'Open Sans', sans-serif;
  padding: 0;
  display: flex;
  justify-content: center;
  * {
    box-sizing: border-box;
  }
  #main-view {
    padding: 30px 10px 60px 10px;
    width: 100vh;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    // background-size: contain;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    #heading {
      margin-bottom: 15px;
      .heading-1 {
        font-size: 23px;
      }
      .heading-2 {
        font-size: 27px;
        font-weight: bold;
      }
    }
    div#counter {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 60px;
    }
    #main-content {
      padding: 10px;
      padding-top: 20px;
      .content {
        text-align: left;
        margin-bottom: 10px;
        font-size: 20px;
      }
      #jesus_signature {
        text-align: right;
        font-size: 24px;
      }
    }
    #footer {
      #qr_code {
        font-size: 14px;
      }
      #message {
        font-size: 14px;
        margin-bottom: 30px;
      }
    }
  }
}
</style>
