<template>
  <div class="playground-viewer">
    <div class="viewer-header">
      <h2>{{ telaAtual?.titulo }}</h2>
      <p>{{ telaAtual?.descricao }}</p>
    </div>

    <div class="viewer-content">
      <component :is="componenteAtual" v-if="componenteAtual" v-bind="propsComponente" />
      <div v-else class="empty-state">
        <p>Selecione uma tela no menu lateral para começar</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, defineAsyncComponent } from 'vue';
  import { usePlaygroundNav } from '../composables/use-playground-nav';
  import TelaUsuarios from '@/components/telas/tela-usuarios/tela-usuarios.vue';

  const { telaAtual } = usePlaygroundNav();

  // Mapeamento de componentes
  const componentesMap: Record<string, any> = {
    'tela-usuarios': TelaUsuarios,
  };

  const componenteAtual = computed(() => {
    if (!telaAtual.value) return null;
    return componentesMap[telaAtual.value.id] || null;
  });

  // Props customizadas por tela
  const propsComponente = computed(() => {
    const telaId = telaAtual.value?.id;

    if (telaId === 'tela-usuarios') {
      return {
        bearerToken: 'mock-token-12345',
      };
    }

    if (telaId === 'ui-button') {
      return {
        label: 'Click me!',
      };
    }

    return {};
  });
</script>
