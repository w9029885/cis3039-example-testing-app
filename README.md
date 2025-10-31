# Frontend App Testing Example

This project provides an example of consuming and displaying data from a backend web api service.

## Local Setup

### Install dependencies

```bash
npm install
```

### Configure local environment variables

```bash
cp .env.example .env.local
```

Update/add values within `.env.local`

> Note: Never commit your `.env.local` to source control. The example is safe to share.

### Compile and Hot-Reload for Development

```bash
npm run dev
```

### Type-Check, Compile and Minify for Production

```bash
npm run build
```

## Testing Features

This project includes the Vitest framework.

There are example unit tests in `src/composables/useProducts.test.ts` and `src/views/Products.test.ts`.

Run all unit tests:

```bash
npm test
```

Run a coverage report:

```bash
npm run test:coverage
```

The framework is configured in `vitest.config.ts` for co-located unit tests: in other words, each test file (`X.test.ts`) lives beside its matching production file (`X.ts`), keeping tests close to the code they verify.

> There may be other branches in this repo demonstrating additional testing features.

## How the project was made

This section explains how you could create a new project in the same style as this one.

Initialise the project files:

```bash
npm create vue@3 . -- \
  --force \
  --bare \
  --typescript \
  --router \
  --prettier
```

Restore any delete devcontainer configuration:

```bash
git restore .devcontainer/devcontainer.json
```

Add extensions to devcontainer:

- `"esbenp.prettier-vscode"`,
- `"Vue.volar"`

Update preferences in `.prettierrc.json`:

- `"semi": true`
- `"singleQuote": true`
- `"printWidth": 80`

## How the project was upgraded to use Vitest

1. Install Vitest and associated packages:

   ```bash
   npm install --save-dev vitest @vitest/coverage-v8 jsdom @vue/test-utils @vitest/ui
   ```

2. Create `vitest.config.ts` in the root of the project:

   ```ts
   import { fileURLToPath, URL } from 'node:url';
   import { defineConfig } from 'vitest/config';
   import vue from '@vitejs/plugin-vue';

   export default defineConfig({
     plugins: [vue()],
     resolve: {
       alias: {
         '@': fileURLToPath(new URL('./src', import.meta.url)),
       },
     },
     test: {
       environment: 'jsdom',
       include: ['src/**/*.{test,spec}.{ts,tsx}'],
     },
   });
   ```

   This configures it to include co-located `X.test.ts` files.

3. Update `tsconfig.app.json`:

   ```json
   "exclude": ["src/**/__tests__/*", "src/**/*.test.ts", "src/**/*.spec.ts"],
   ```

   The `exclude` prevents co-located test code being compiled into your production build.

4. Add npm scripts to `package.json`

   Replace the current dummy `test` script:

   ```json
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
   ```

5. Add to `.gitignore`:

   ```
   .vitest
   ```

   This excludes the generated test outputs from being commited to your git repo.
