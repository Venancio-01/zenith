import { ref, onUnmounted } from 'vue';
import { globalStore, type GlobalState } from '@zenith/store';

// 创建一个自定义的 composition function
export function useGlobalStore() {
  // 将 Zustand 的 state 包装在 Vue 的 ref 中
  const storeState = ref<GlobalState>(globalStore.getState());

  // 订阅 Zustand store 的变化
  // 当 store 变化时，自动更新 ref
  const unsubscribe = globalStore.subscribe((newState) => {
    storeState.value = newState;
  });

  // 在组件卸载时自动取消订阅
  onUnmounted(() => {
    unsubscribe();
  });

  return {
    // 直接返回响应式的 state 和原始的 actions
    state: storeState,
    actions: globalStore.getState(),
  };
}
