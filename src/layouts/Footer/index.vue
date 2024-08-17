<template>
  <ant-layout-footer :class="$style.footer">
    Copy Right
  </ant-layout-footer>
</template>

<script>
  import { defineComponent } from 'vue';
  import { Layout } from 'ant-design-vue';

  export default defineComponent({
    components: {
      'ant-layout-footer': Layout.Footer
    }
  });
</script>

<style lang="scss" module>
  .footer {
    padding: 0 !important;
    height: 30px;
    line-height: 30px;
    background-color: #ddd;
    text-align: center;
  }
</style>