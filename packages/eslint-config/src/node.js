import { createBase } from './base.js';
import globals from 'globals';

export default createBase({
  ...globals.node,
  ...globals.es2022,
});
