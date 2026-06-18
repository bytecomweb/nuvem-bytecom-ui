# AGENTS.md — @nuvem-bytecom/ui

Vue 3 component library (PrimeVue 4 + Tailwind CSS 4 + TypeScript). Built with Vite library mode.

## Commands (order matters)

```sh
npm run dev          # Playground dev server (localhost:5173)
npm run build        # vite build → vue-tsc --emitDeclarationOnly → tsc-alias (resolves @/ in .d.ts)
npm run typecheck    # vue-tsc --noEmit (fast type check, no build)
npm run lint         # eslint . --ext .js,.ts --max-warnings 0
npm run lint:fix     # auto-fix
npm run format       # prettier --write "src/**/*.{js,ts,vue,json,css}"
npm run format:check # check only
```

- `prepare` = `npm run build` — runs on `npm install`, so a fresh install builds the lib.
- No test runner exists in the project.

## Build quirks

- `vite.config.ts` builds a **library** (`build.lib`), not an app. External: `vue`, `primevue/*`, `@primeuix/*`.
- `tsconfig.build.json` excludes `src/playground/**`. The dev playground is not part of the published package.
- `tsc-alias` is needed because `vue-tsc` does not resolve `@/` path aliases in emitted `.d.ts`.
- Output: `dist/` — dual CJS/ESM, types, and `style.css`.
- Package `exports` map: `"."` → main bundle, `"./style.css"` → dist stylesheet.

## ESLint — two configs co-exist

- `eslint.config.js` (flat config, takes precedence in ESLint 10) **is the active config**.
- `.eslintrc.json` is legacy — do not rely on it.
- Rule: `vue/multi-word-component-names: off` (single-word component names allowed).

## Codebase structure

| Path | Role |
|---|---|
| `src/index.ts` | Library entrypoint — exports all public API, registers the Vue plugin |
| `src/components/telas/` | Page-level components (`tela-*`), each with co-located `components/`, `schemas/`, `types/` |
| `src/components/inputs/` | Input wrappers (CPF/CNPJ, CEP, telefone, mask) — use PrimeVue InputText + `maska` |
| `src/components/selects/` | Single-file select wrappers |
| `src/components/modals/` | Modal/form components |
| `src/data/<domain>/` | One file per API call, exporting a default async function |
| `src/schemas/` | Zod schemas (uses `@brazilian-utils/brazilian-utils` for CPF/CNPJ/CEP validation) |
| `src/types/modelos/` | Domain model types |
| `src/types/respostas/` | API response envelope: `Resposta`, `RespostaSucesso<T>`, `RespostaPaginada<T>` |
| `src/services/api.ts` | Singleton Axios instance (`useApiService()` / `getApiService()`) |
| `src/composables/` | `use-notification` (toast wrapper) and `use-api` |
| `src/utils/` | Text, request-error, and constant helpers |
| `src/playground/` | Dev app with mock API — excluded from build |

## Conventions

- **Style**: Tailwind CSS 4 syntax — `@import 'tailwindcss'` (not `@tailwind base/...`).
- **Prettier**: singleQuote, semi, trailingComma "es5", printWidth 100, LF.
- **Components**: `<script lang="ts" setup>`, `defineProps` / `defineModel`, PascalCase filenames.
- **API data layer**: each file in `src/data/<domain>/` is a default-exported `async (api: AxiosInstance, params) => RespostaSucesso<T>`.
- **API response shape**: `{ erro: boolean, mensagem: string, dados: T, paginacao?: Paginacao }`.
- **Plugin**: The default export is a Vue plugin that auto-installs PrimeVue, ConfirmationService, ToastService, keyfilter/tooltip directives, and provides the API service. Consumers can disable PrimeVue install with `installPrimeVue: false`.
- **Custom InputMask**: defined in `src/components/inputs/input-mask.vue` — wraps PrimeVue InputText with `maska` lib (not PrimeVue's InputMask). Has a `@ts-ignore` for maska's mask type.
- **Labels/text**: all in Portuguese (no i18n).

## Gotchas

- Two eslint configs: only `eslint.config.js` is active. `.eslintrc.json` is stale — ignore/delete it.
- `@ts-ignore` in `input-mask.vue` (maska typing mismatch) — avoid adding more.
- Build runs on `prepare` (npm install) — can be surprising on a fresh clone.
- No CI workflows, no test infrastructure.
