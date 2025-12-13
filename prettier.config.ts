// prettier.config.ts, .prettierrc.ts, prettier.config.mts, or .prettierrc.mts

import { type Config } from 'prettier';

const config: Config = {
  trailingComma: 'none',
  tabWidth: 2,
  singleQuote: true,
  jsxSingleQuote: true,
  semi: true,
  printWidth: 100,
  arrowParens: 'avoid',
  useTabs: false,
  bracketSameLine: true,
  bracketSpacing: true
};

export default config;
