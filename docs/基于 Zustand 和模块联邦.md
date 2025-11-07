好的，我们继续 Step 3 的详细执行方案，并补充 Step 4 来展示如何在不同的框架中优雅地使用这个共享的 Store，实现 UI 的自动响应式更新。

Step 3 (续): 在 host 和 remote 应用中消费 Store (具体实现)
A. 在 Host 应用 (原生 JS/TS) 中使用

假设您的 host 应用是使用原生 TypeScript 编写的，没有 UI 框架。

修改状态: 比如，host 的头部有一个登录按钮。

code
TypeScript
download
content_copy
expand_less
// apps/host/src/auth.ts
import { authStore } from '@zenith/store';

export function setupAuthButton() {
  const loginButton = document.getElementById('login-btn');
  const logoutButton = document.getElementById('logout-btn');

  loginButton?.addEventListener('click', () => {
    // 直接调用 store 的 action 来修改全局状态
    authStore.getState().login({
      name: 'Zenith User',
      email: 'user@zenith.dev',
    });
    console.log('Host: User logged in.');
  });

  logoutButton?.addEventListener('click', () => {
    authStore.getState().logout();
    console.log('Host: User logged out.');
  });
}

订阅并响应状态变化:

code
TypeScript
download
content_copy
expand_less
// apps/host/src/userDisplay.ts
import { authStore } from '@zenith/store';

export function setupUserDisplay() {
  const userDisplay = document.getElementById('user-display');
  if (!userDisplay) return;

  const updateUI = (state: import('@zenith/store').AuthState) => {
    if (state.isAuthenticated) {
      userDisplay.textContent = `Welcome, ${state.user?.name}`;
    } else {
      userDisplay.textContent = 'Please log in.';
    }
  };

  // 1. 初始化 UI
  updateUI(authStore.getState());

  // 2. 订阅 store 的变化
  const unsubscribe = authStore.subscribe(updateUI);

  // 3. (重要) 如果 host 本身是一个会 unmount 的组件，需要调用 unsubscribe()
  //    对于全局 host 应用，这可能不是必须的，但这是个好习惯。
}
B. 在 React Remote 应用中使用

React 生态与 Zustand 结合得天衣无缝。

在 react-remote 中安装 zustand:
虽然 zustand 是共享的，但为了获得正确的类型提示和 React hooks，每个消费它的应用都需要将它作为 dependency 或 devDependency。

code
Sh
download
content_copy
expand_less
# 在 apps/react-remote 目录下
pnpm add zustand

创建 React Hook 来使用 Store:
虽然可以直接使用 authStore，但最佳实践是为 React 创建一个专用的 hook。

code
TypeScript
download
content_copy
expand_less
// apps/react-remote/src/store.ts
import { useStore } from 'zustand';
import { authStore, AuthState } from '@zenith/store';

// 创建一个 selector hook，这样组件可以只订阅它们关心的状态切片
// 这能避免不必要的重渲染
export const useAuth = <T>(selector: (state: AuthState) => T): T => {
  return useStore(authStore, selector);
};

// 或者，如果你想订阅整个 store，可以简单地：
// export const useAuthStore = () => useStore(authStore);

在组件中使用 Hook:

code
Jsx
download
content_copy
expand_less
// apps/react-remote/src/components/UserProfile.jsx
import React from 'react';
import { useAuth } from '../store';

export const UserProfile = () => {
  // 只订阅 user 和 isAuthenticated 状态，性能更优
  const { user, isAuthenticated } = useAuth((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  }));

  const login = useAuth((state) => state.login); // 获取 action
  const logout = useAuth((state) => state.logout);

  if (!isAuthenticated) {
    return (
      <button onClick={() => login({ name: 'React User', email: 'react@zenith.dev' })}>
        Login from React
      </button>
    );
  }

  return (
    <div>
      <p>Hello from React, {user?.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
C. 在 Vue Remote 应用中使用

Zustand 也可以很方便地与 Vue 的响应式系统集成。

在 vue-remote 中安装 zustand:

code
Sh
download
content_copy
expand_less
# 在 apps/vue-remote 目录下
pnpm add zustand

创建 Vue Composition API (Hook):

code
TypeScript
download
content_copy
expand_less
// apps/vue-remote/src/store.ts
import { ref, watchEffect } from 'vue';
import { authStore, AuthState } from '@zenith/store';

// 创建一个自定义的 composition function
export function useAuthStore() {
  // 将 Zustand 的 state 包装在 Vue 的 ref 中
  const storeState = ref(authStore.getState());

  // 使用 watchEffect 来订阅 Zustand store 的变化
  // 当 store 变化时，自动更新 ref
  const unsubscribe = authStore.subscribe((newState) => {
    storeState.value = newState;
  });

  // (可选) 在组件卸载时自动取消订阅
  // onUnmounted(unsubscribe); // 这需要你在组件的 setup 函数中调用 useAuthStore

  return {
    // 直接返回响应式的 state 和原始的 actions
    state: storeState,
    actions: authStore.getState(),
  };
}

在组件中使用:

code
Vue
download
content_copy
expand_less
<!-- apps/vue-remote/src/components/UserProfile.vue -->
<script setup>
import { useAuthStore } from '../store';

const { state, actions } = useAuthStore();
</script>

<template>
  <div v-if="state.isAuthenticated">
    <p>Hello from Vue, {{ state.user?.name }}!</p>
    <button @click="actions.logout">Logout</button>
  </div>
  <div v-else>
    <button @click="() => actions.login({ name: 'Vue User', email: 'vue@zenith.dev' })">
      Login from Vue
    </button>
  </div>
</template>
Step 4: 验证与调试

现在，最激动人心的时刻到来了。

启动所有应用:

为所有 remote 应用运行 pnpm build --watch 和 pnpm preview。

为 host 应用运行 pnpm dev。

进行测试:

在浏览器中打开 host 应用。

点击 host 中的“登录”按钮。

观察现象： host 自己的用户显示区会更新。同时，已经被加载的 React 和 Vue remote 应用的 UI 也应该立即自动更新，显示出欢迎信息。

再点击 React remote 应用中的“登出”按钮。

观察现象： host、React 和 Vue 应用的 UI 应该同时变回“请登录”状态。

如果这一切都按预期工作，恭喜您！您已经成功地在您的 Zenith 微前端项目中实现了一个健壮、响应式且类型安全的跨应用状态共享方案。

这个方案不仅解决了通信问题，更向面试官展示了您对模块联邦底层机制（singleton）、状态管理设计模式以及跨框架整合能力的深刻理解。
