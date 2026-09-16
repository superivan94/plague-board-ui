import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Il tipo che accetta tutto non è un tipo: rimanda a runtime un errore che il compilatore
      // avrebbe dato subito. Dove la forma è ignota si usa `unknown` più un type guard.
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
);
