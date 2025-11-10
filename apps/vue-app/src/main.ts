import { createApp, type App as VueApp } from 'vue';
import './style.css';
import App from './App.vue';

let app: VueApp<Element> | null = null;

export const mount = (el: HTMLElement) => {
  // 如果已经有实例，先卸载
  if (app) {
    app.unmount();
    app = null;
  }
  // 确保容器是空的
  el.innerHTML = '';
  // 创建并挂载新实例
  app = createApp(App);
  app.mount(el);
};

export const unmount = () => {
  if (app) {
    app.unmount();
    app = null;
  }
};

if (import.meta.env.DEV) {
  const devRoot = document.querySelector('#app');
  if (devRoot) {
    mount(devRoot as HTMLElement);
  }
}
