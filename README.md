# Nuvem Bytecom UI

Base de um package de UI em Vue 3 com TypeScript, Vite e PrimeVue.

## Scripts

- `npm run dev`: abre o playground local para desenvolver componentes
- `npm run build`: gera a biblioteca em `dist/` e emite arquivos de tipos
- `npm run typecheck`: valida a tipagem do projeto

## Estrutura

- `src/components`: componentes reutilizaveis
- `src/index.ts`: exports publicos da biblioteca
- `src/playground`: app local para testar os componentes durante o desenvolvimento

## Stack

- Vue 3
- PrimeVue 4
- `@primeuix/themes` com preset Aura por padrao
- Axios para camada HTTP compartilhada
- Vite em modo biblioteca

## Uso

```ts
import { createApp } from "vue";
import App from "./App.vue";
import NuvemBytecomUi from "@nuvem-bytecom/ui";
import "@nuvem-bytecom/ui/style.css";

createApp(App)
  .use(NuvemBytecomUi, {
    api: {
      baseURL: import.meta.env.VITE_API_URL,
      prefix: "api/v1",
    },
  })
  .mount("#app");
```

Por padrao, o plugin tambem instala o `VueQueryPlugin` com um `QueryClient` interno.

Se voce quiser reutilizar um `QueryClient` proprio do projeto consumidor:

```ts
import { QueryClient } from "@tanstack/vue-query";

const queryClient = new QueryClient();

createApp(App)
  .use(NuvemBytecomUi, {
    queryClient,
    api: {
      baseURL: import.meta.env.VITE_API_URL,
      prefix: "api/v1",
    },
  })
  .mount("#app");
```

Se precisar desabilitar a instalacao automatica do Vue Query:

```ts
createApp(App)
  .use(NuvemBytecomUi, {
    installVueQuery: false,
  })
  .mount("#app");
```

Ou com import pontual:

```ts
import { UiButton } from "@nuvem-bytecom/ui";
```

## API Service

Cada projeto que consumir a lib pode configurar sua propria URL base e prefixo da API no momento da instalacao do plugin.

```ts
createApp(App)
  .use(NuvemBytecomUi, {
    api: {
      baseURL: "https://meu-backend.com",
      prefix: "api/admin",
      axios: {
        timeout: 10000,
      },
    },
  })
  .mount("#app");
```

O `baseURL` final do client vira a composicao de `baseURL + prefix`.

Exemplo:

- `baseURL: "https://meu-backend.com"`
- `prefix: "api/admin"`
- resultado: `https://meu-backend.com/api/admin`

Para usar o client configurado:

```ts
import { useApiService } from "@nuvem-bytecom/ui";

const api = useApiService();

await api.instance.get("/usuarios");
```

Fora do contexto de `setup()`, voce pode usar o helper exportado:

```ts
import { getApiService } from "@nuvem-bytecom/ui";

await getApiService().instance.get("/usuarios");
```

Se a aplicacao hospedeira ja instalar o PrimeVue manualmente, desabilite a instalacao automatica do plugin:

```ts
createApp(App)
  .use(NuvemBytecomUi, {
    installPrimeVue: false,
  })
  .mount("#app");
```
