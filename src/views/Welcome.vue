<template>
  <AssetView :assetURL="welcome.currentAsset" :posterURL="welcome.currentPoster" />
</template>

<script>
import { mapState, mapActions } from 'vuex';
import AssetView from '@/components/assets/View.vue';

export default {
  created() {
    this.fetchAsset();
  },
  components: {
    AssetView,
  },
  computed: {
    ...mapState(['welcome']),
  },
  methods: {
    ...mapActions('welcome', ['fetchAsset']),
  },
};
</script>

<style lang="scss" scoped></style>
