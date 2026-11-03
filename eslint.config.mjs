import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['.features-gen/', 'playwright-report/', 'test-results/', 'blob-report/', 'node_modules/'] },
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Assertions live in BDD step definitions, not inside test() blocks.
      'playwright/no-standalone-expect': 'off',
      'playwright/no-raw-locators': 'warn',
      'playwright/prefer-web-first-assertions': 'error',
      'playwright/no-wait-for-timeout': 'error',
    },
  },
  prettier,
);
