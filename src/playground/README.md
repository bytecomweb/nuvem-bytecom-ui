# Como Adicionar Novas Telas ao Playground

## Estrutura

O playground é modularizado para facilitar testes de componentes e telas:

```
playground/
├── components/
│   ├── playground-sidebar.vue      # Navegação lateral
│   └── playground-viewer.vue       # Renderizador de componentes
├── composables/
│   └── use-playground-nav.ts       # Gerencia navegação
├── mocks/
│   └── api-mock.ts                 # Mock de respostas da API
├── App.vue                          # Layout principal
└── main.ts                          # Inicialização
```

## Adicionando uma Nova Tela

### 1. Registrar a Tela (use-playground-nav.ts)

```typescript
// src/playground/composables/use-playground-nav.ts
const TELAS_DISPONIVEIS: TelaDemo[] = [
  // ... telas existentes ...
  {
    id: 'minha-tela', // ID único
    titulo: 'Minha Tela', // Título exibido no menu
    descricao: 'Descrição...', // Descrição exibida no header
    grupo: 'Telas', // Grupo para agrupar no menu
  },
];
```

### 2. Adicionar o Componente (playground-viewer.vue)

```typescript
// src/playground/components/playground-viewer.vue
import MinhaTelaComponent from '@/components/telas/minha-tela/minha-tela.vue';

const componentesMap: Record<string, any> = {
  // ... componentes existentes ...
  'minha-tela': MinhaTelaComponent,
};

// Se precisar de props customizadas:
const propsComponente = computed(() => {
  // ...
  if (telaId === 'minha-tela') {
    return {
      bearerToken: 'mock-token-12345',
      // ... outras props ...
    };
  }
});
```

### 3. Configurar Mock de API (opcional)

Se a sua tela faz chamadas à API, adicione os mocks em `src/playground/mocks/api-mock.ts`:

```typescript
// Adicione no setupMockApi()
if (config.url === '/seu-endpoint' && config.method === 'get') {
  return Promise.resolve({
    status: 200,
    data: {
      erro: false,
      mensagem: 'Sucesso',
      dados: [...dados...],
    },
  });
}
```

## Executar o Playground

```bash
npm run dev
```

O playground abrirá em `http://localhost:5173` com:

- **Sidebar esquerda**: Navegação entre telas/componentes
- **Painel principal**: Exibição do componente selecionado
- **Mock de API**: Todas as requisições são interceptadas e respondidas localmente

## Dicas

- Use localStorage para persistir a tela selecionada entre recarregamentos
- Os dados dos mocks são compartilhados (`usuariosMock` é um array que persiste durante a sessão)
- Adicione novos endpoints mock conforme necessário
- Valores padrão de `bearerToken` e outras props podem ser customizados por tela
