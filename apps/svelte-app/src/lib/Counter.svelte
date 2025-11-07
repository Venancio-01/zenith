<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { globalStore, type GlobalState } from '@zenith/store';

  let count = $state(0);
  let unsubscribe: (() => void) | null = null;

  onMount(() => {
    // 初始化状态
    count = globalStore.getState().count;

    // 订阅 store 变化
    unsubscribe = globalStore.subscribe((newState: GlobalState) => {
      count = newState.count;
    });
  });

  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });
</script>

<div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
  <p class="text-lg font-semibold text-gray-900 dark:text-white">
    Count from Svelte: {count}
  </p>
</div>

<style>
  /* Component specific styles */
</style>
