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
  import { computed } from 'vue';
  import { usePlaygroundNav } from '../composables/use-playground-nav';
  import TelaUsuarios from '@/components/telas/tela-usuarios/tela-usuarios.vue';

  const { telaAtual } = usePlaygroundNav();

  const componentesMap: Record<string, any> = {
    'tela-usuarios': TelaUsuarios,
  };

  const componenteAtual = computed(() => {
    if (!telaAtual.value) return null;
    return componentesMap[telaAtual.value.id] || null;
  });

  const propsComponente = computed(() => {
    const telaId = telaAtual.value?.id;

    if (telaId === 'tela-usuarios') {
      return { bearerToken: 'mock-token-12345' };
    }

    return {};
  });
</script>

<style scoped>
  .playground-viewer {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
  }

  .viewer-header {
    background: white;
    border-bottom: 1px solid #e2e8f0;
    flex-shrink: 0;
    padding: 1.25rem 1.5rem;
  }

  .viewer-header h2 {
    color: #1e293b;
    font-size: 1.25rem;
    margin: 0 0 0.25rem;
  }

  .viewer-header p {
    color: #64748b;
    font-size: 0.875rem;
    margin: 0;
  }

  .viewer-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    overflow: auto;
  }

  .empty-state {
    align-items: center;
    color: #94a3b8;
    display: flex;
    flex: 1;
    justify-content: center;
  }
</style>
