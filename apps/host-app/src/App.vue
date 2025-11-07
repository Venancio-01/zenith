<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useGlobalStore } from './composables/useGlobalStore';

const { state: globalState, setCount } = useGlobalStore();
const activeApp = ref<string>('home');
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const countInput = ref<number>(0);

const apps = [
  { id: 'home', name: 'Home', path: '/' },
  { id: 'vue-app', name: 'Vue App', path: '/vue-app' },
  { id: 'react-app', name: 'React App', path: '/react-app' },
  { id: 'svelte-app', name: 'Svelte App', path: '/svelte-app' },
]

// 存储已加载的 remote app 的 unmount 函数
const unmountFunctions = new Map<string, () => void>()

const switchApp = (appId: string) => {
  activeApp.value = appId
}

// 卸载指定的 app
const unmountApp = (appId: string) => {
  const unmountFn = unmountFunctions.get(appId)
  if (unmountFn) {
    unmountFn()
    unmountFunctions.delete(appId)
  }
  // 清空容器内容，确保 DOM 被完全清理
  const container = document.getElementById(`remote-${appId}`)
  if (container) {
    container.innerHTML = ''
  }
}

// 加载并挂载 remote app
const loadRemoteApp = async (appId: string, oldAppId?: string) => {
  if (appId === 'home') {
    // 切换到 home 时，卸载之前显示的 app
    if (oldAppId && oldAppId !== 'home') {
      unmountApp(oldAppId)
    }
    return
  }

  loading.value = true
  error.value = null

  try {
    // 先卸载之前显示的 app（如果有且不是同一个 app）
    if (oldAppId && oldAppId !== 'home' && oldAppId !== appId) {
      unmountApp(oldAppId)
    }

    // 卸载同一个 app 的旧实例（如果有）
    const prevUnmount = unmountFunctions.get(appId)
    if (prevUnmount) {
      unmountApp(appId)
    }

    // 等待 DOM 更新
    await nextTick()

    // 获取容器元素
    const container = document.getElementById(`remote-${appId}`)
    if (!container) {
      throw new Error(`Container not found for app: ${appId}`)
    }

    const remoteModuleMap: Record<string, () => Promise<any>> = {
      'vue-app': () => import('vue-app/App'),
      'react-app': () => import('react-app/App'),
      'svelte-app': () => import('svelte-app/App'),
    }

    const loadRemote = remoteModuleMap[appId]
    if (!loadRemote) {
      throw new Error(`Unknown app: ${appId}`)
    }

    // 动态加载 remote app
    const remoteModule = await loadRemote()
    console.log('🚀 - loadRemoteApp - remoteModule:', remoteModule)

    // 解构 default 属性，获取 mount 和 unmount
    const { mount, unmount: unmountFn } = remoteModule.default || remoteModule

    // 调用 mount 函数
    if (mount) {
      mount(container)
      // 保存 unmount 函数
      if (unmountFn) {
        unmountFunctions.set(appId, unmountFn)
      }
    } else {
      throw new Error(`Mount function not found in ${appId}`)
    }
  } catch (err) {
    console.error(`Failed to load remote app ${appId}:`, err)
    error.value = `Failed to load ${appId}: ${err instanceof Error ? err.message : String(err)}`
  } finally {
    loading.value = false
  }
}

// 卸载所有 remote app
const unmountAll = () => {
  unmountFunctions.forEach((unmount, appId) => {
    unmount()
    // 清空容器内容
    const container = document.getElementById(`remote-${appId}`)
    if (container) {
      container.innerHTML = ''
    }
  })
  unmountFunctions.clear()
}

// 监听 activeApp 变化，加载对应的 remote app
watch(activeApp, (newAppId, oldAppId) => {
  loadRemoteApp(newAppId, oldAppId)
})

// 组件挂载时，如果 activeApp 不是 home，则加载对应的 app
onMounted(() => {
  if (activeApp.value !== 'home') {
    loadRemoteApp(activeApp.value, 'home')
  }
})

// 组件卸载时，清理所有 remote app
onUnmounted(() => {
  unmountAll()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Zenith Host App
            </h1>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-700 dark:text-gray-300">
                Global Count: {{ globalState.count }}
              </span>
            </div>
          </div>
          <nav class="flex space-x-4">
            <button
              v-for="app in apps"
              :key="app.id"
              @click="switchApp(app.id)"
              :class="[
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                activeApp === app.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              ]"
            >
              {{ app.name }}
            </button>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="activeApp === 'home'" class="text-center">
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Zenith Host App
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
          This is the main host application built with Vue 3
        </p>

        <!-- Global Count Control -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-md mx-auto mb-8">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Global Count Control
          </h3>
          <p class="text-lg text-gray-700 dark:text-gray-300 mb-4">
            Current Count: <span class="font-bold text-blue-600 dark:text-blue-400">{{ globalState.count }}</span>
          </p>
          <div class="flex items-center justify-center space-x-4">
            <input
              v-model.number="countInput"
              type="number"
              placeholder="Enter count"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              @click="setCount(countInput)"
              class="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Set Count
            </button>
          </div>
          <div class="mt-4 flex justify-center space-x-2">
            <button
              @click="setCount(globalState.count + 1)"
              class="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
            >
              +1
            </button>
            <button
              @click="setCount(globalState.count - 1)"
              class="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            >
              -1
            </button>
            <button
              @click="setCount(0)"
              class="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div
            v-for="app in apps.filter(a => a.id !== 'home')"
            :key="app.id"
            class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            @click="switchApp(app.id)"
          >
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {{ app.name }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Click to load {{ app.name }}
            </p>
          </div>
        </div>
      </div>

      <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {{ apps.find(a => a.id === activeApp)?.name }}
        </h2>
        <div v-if="loading" class="text-center py-8">
          <p class="text-gray-600 dark:text-gray-400">
            Loading remote application...
          </p>
        </div>
        <div v-else-if="error" class="text-center py-8">
          <p class="text-red-600 dark:text-red-400">{{ error }}</p>
        </div>
        <!-- Remote app container will be mounted here -->
        <div :id="`remote-${activeApp}`" class="mt-4"></div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Component specific styles */
</style>

