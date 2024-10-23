import { ref } from 'vue';
import { defineStore } from 'pinia';

/**
 * @type {
 *   import('pinia').StoreDefinition<
 *     'index',
 *     import('pinia')._ExtractStateFromSetupStore<unknown>,
 *     import('pinia')._ExtractGettersFromSetupStore<unknown>,
 *     import('pinia')._ExtractActionsFromSetupStore<unknown>
 *   >
 * }
 */
const useStore = defineStore('index', function() {
  const likeLen = ref(0);

  function setLikeLen(payload) {
    likeLen.value = payload;
  }

  return { likeLen, setLikeLen };
});

export default useStore;