// Module Federation 远程模块类型声明

interface RemoteModule {
  mount: (container: HTMLElement) => void;
  unmount: () => void;
}

// vue-app 导出命名导出
declare module 'vue-app/App' {
  export const mount: (container: HTMLElement) => void;
  export const unmount: () => void;
}

// react-app 导出命名导出
declare module 'react-app/App' {
  export const mount: (container: HTMLElement) => void;
  export const unmount: () => void;
}

// svelte-app 导出命名导出
declare module 'svelte-app/App' {
  export const mount: (container: HTMLElement) => void;
  export const unmount: () => void;
}
