import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['node_modules/**', 'reports/**', 'test-results/**']
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended
)
