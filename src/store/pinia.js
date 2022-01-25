import { createPinia } from 'pinia';

export let pinia;

/* 创建pinia */
export function piniaFactory(initialState = {}) {
  if (!pinia) {
    pinia = createPinia();
    pinia.state.value = initialState;
  }

  return pinia;
}