<script setup lang="ts">
import { useGlobalStore } from '../store';

const { state } = useGlobalStore();
</script>

<template>
  <div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <p class="text-lg font-semibold text-gray-900 dark:text-white">
      Count from Vue: {{ state.count }}
    </p>
  </div>
</template>
