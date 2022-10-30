<template>
  <div id="passphrase-form">
    <input type="text" name="passphrase" v-model="passphrase" placeholder="Enter your passphrase" />
    <button type="submit" @click="verifyPassphrase">Verify</button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      passphrase: '',
    };
  },
  mounted() {
    if (this.$store.getters['auth/isPassphrasePassed']) {
      this.$router.push({ name: 'main-screen' });
    }
  },
  methods: {
    verifyPassphrase() {
      this.storePassphrase(this.passphrase).then(() => {
        if (this.isPassphrasePassed) {
          this.$router.push({ name: 'main-screen' });
        } else {
          this.$swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Passphrase is invalid!',
            confirmButtonColor: '#d33',
          });
        }
      });
    },
    ...mapActions('auth', ['storePassphrase']),
  },
  computed: {
    ...mapGetters('auth', ['isPassphrasePassed']),
  },
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@900&display=swap');

#passphrase-form {
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;

  input {
    margin-right: 10px;
    padding: 8px 10px;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    font-size: 18px;
  }

  button {
    padding: 8px 15px;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    font-size: 18px;
    background-color: rgb(25, 135, 84);
    color: #fff;
  }
}
</style>
