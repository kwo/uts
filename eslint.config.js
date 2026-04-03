import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          impliedStrict: true,
        },
      },
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs}', '**/*.config.{js,ts,mjs,mts}'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    rules: {
      camelcase: ['warn'],
      'class-methods-use-this': ['warn'],
      'consistent-return': ['error'],
      'consistent-this': ['error', 'self'],
      curly: ['error'],
      'dot-notation': ['warn'],
      'no-duplicate-imports': ['warn'],
      'no-irregular-whitespace': ['error'],
      'no-shadow': ['error'],
      'no-use-before-define': ['warn', { functions: false }],
      'no-var': ['error'],
      'block-scoped-var': ['error'],
      yoda: ['warn', 'never'],
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/no-unnecessary-condition': ['off'],
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': ['off'],
      '@typescript-eslint/no-unnecessary-type-conversion': ['off'],
    },
  }
);
