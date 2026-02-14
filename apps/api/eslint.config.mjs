import { nestJsConfig } from '@repo/config-eslint/nest-js';

/** @type {import("eslint").Linter.Config} */
export default [
  ...nestJsConfig,
  {
    ignores: ['eslint.config.mjs'],
  },
];
