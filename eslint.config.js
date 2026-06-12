// https://docs.expo.dev/guides/using-eslint/
// ESLint 9 flat config: ignores live here (`.eslintignore` is not used).
const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  globalIgnores([
    'node_modules/**',
    '.expo/**',
    'dist/**',
    'web-build/**',
    'coverage/**',
    'ios/**',
    'android/**',
    'src/lib/holepunch/bare/**',
    '*.tsbuildinfo',
  ]),
  expoConfig,
  eslintPluginPrettierRecommended,
]);
