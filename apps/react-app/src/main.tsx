import { StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

let root: Root | null = null;

// 导出 mount 函数，供 host 应用调用
export const mount = (container: HTMLElement) => {
  root = createRoot(container);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

// 导出 unmount 函数，供 host 应用调用
export const unmount = () => {
  if (root) {
    root.unmount();
    root = null;
  }
};

// 开发环境下，如果存在 #root 元素，则自动挂载
if (import.meta.env.DEV && document.getElementById('root')) {
  mount(document.getElementById('root')!);
}
