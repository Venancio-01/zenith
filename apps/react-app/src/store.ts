import { useStore } from 'zustand';
import { globalStore, type GlobalState } from '@zenith/store';

// 创建一个 selector hook，这样组件可以只订阅它们关心的状态切片
// 这能避免不必要的重渲染
export const useGlobalStore = <T>(selector: (state: GlobalState) => T): T => {
  return useStore(globalStore, selector);
};
