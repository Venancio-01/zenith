import { mount as svelteMount, unmount as svelteUnmount } from 'svelte';
import './app.css';
import App from './App.svelte';

let mountResult: Record<string, unknown> | null = null;

// 导出 mount 函数，供 host 应用调用
export const mount = (container: HTMLElement) => {
  // Svelte 5 的 mount 返回一个对象（Exports），包含组件导出的所有内容
  mountResult = svelteMount(App, {
    target: container,
  });
};

// 导出 unmount 函数，供 host 应用调用
export const unmount = () => {
  if (mountResult) {
    // Svelte 5 的 unmount 是一个独立的函数，需要传入 mount 返回的对象
    svelteUnmount(mountResult);
    mountResult = null;
  }
};

// 开发环境下，如果存在 #app 元素，则自动挂载
if (import.meta.env.DEV && document.getElementById('app')) {
  mount(document.getElementById('app')!);
}
