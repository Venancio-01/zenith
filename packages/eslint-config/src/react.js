import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import app from './app.js';

const hooksCfg = reactHooks.configs['recommended-latest'];
const refreshCfg = reactRefresh.configs.vite;

export default [
  ...app,
  ...(Array.isArray(hooksCfg) ? hooksCfg : [hooksCfg]),
  ...(Array.isArray(refreshCfg) ? refreshCfg : [refreshCfg]),
];
