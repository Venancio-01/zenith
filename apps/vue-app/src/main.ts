import { createApp, type App as VueApp } from 'vue';
import './style.css';
import App from './App.vue';

let app: VueApp<Element> | null = null;

export const mount = (el: HTMLElement) => {
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
