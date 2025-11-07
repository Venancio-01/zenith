import { ref, onMounted, onUnmounted } from 'vue';
import { globalStore, type GlobalState } from '@zenith/store';

export function useGlobalStore() {
  const state = ref<GlobalState>(globalStore.getState());
  let unsubscribe: (() => void) | null = null;

  const updateState = (newState: GlobalState) => {
    state.value = newState;
  };

  onMounted(() => {
    // 初始化状态
    updateState(globalStore.getState());
    // 订阅 store 变化
    unsubscribe = globalStore.subscribe(updateState);
  });

  // 在组件卸载时取消订阅
  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });

  return {
    state,
    setCount: (count: number) => {
      globalStore.getState().setCount(count);
    },
  };
}
