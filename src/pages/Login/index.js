import { computed } from 'vue';
import { useHead } from '@vueuse/head';
import Login from './Login';

export default {
  setup() {
    useHead({
      title: computed(() => 'Webpack App - login')
    });
  },

  render() {
    return (
      <Login />
    );
  }
};