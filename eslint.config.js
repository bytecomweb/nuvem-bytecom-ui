import js from '@eslint/js';
import ts from 'typescript-eslint';

export default [
  {
    ignores: ['node_modules', 'dist', '.git', '.vscode'],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ['**/*.{ts,js}'],
    languageOptions: {
      parser: ts.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
];
