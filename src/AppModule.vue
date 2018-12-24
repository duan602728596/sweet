<template>
  <div class="app" id="app" style="height: 100%;">
    <Layout />
  </div>
</template>

<script type="text/javascript">
  import Layout from './assembly/Layout/index.vue';

  export default {
    name: 'AppModule',
    components: {
      Layout
    }
  };
</script>

<style lang="scss">
  body, html, .app {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>