<template>
  <aside class="playground-sidebar">
    <div class="sidebar-header">
      <h1 class="sidebar-title">Playground</h1>
      <p class="sidebar-subtitle">Componentes & Telas</p>
    </div>

    <div class="sidebar-content">
      <div v-for="(telas, grupo) in todasAsAgrupadaas" :key="grupo" class="grupo">
        <h3 class="grupo-titulo">{{ grupo }}</h3>
        <nav class="grupo-nav">
          <button
            v-for="tela in telas"
            :key="tela.id"
            :class="['nav-item', { ativo: telaAtual?.id === tela.id }]"
            @click="selecionarTela(tela.id)"
          >
            <span class="nav-item-titulo">{{ tela.titulo }}</span>
            <span class="nav-item-desc">{{ tela.descricao }}</span>
          </button>
        </nav>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { usePlaygroundNav } from '../composables/use-playground-nav';

  const { telaAtual, todasAsAgrupadaas, selecionarTela, carregarTelaSalva } = usePlaygroundNav();

  onMounted(() => {
    carregarTelaSalva();
  });
</script>

<style scoped>
  .playground-sidebar {
    background: #1e293b;
    border-right: 1px solid #334155;
    color: #e2e8f0;
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 0;
    width: 280px;
  }

  .sidebar-header {
    border-bottom: 1px solid #334155;
    padding: 1.5rem;
  }

  .sidebar-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0 0 0.25rem;
  }

  .sidebar-subtitle {
    color: #94a3b8;
    font-size: 0.875rem;
    margin: 0;
  }

  .sidebar-content {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 0;
  }

  .grupo {
    padding: 0.5rem 0;
  }

  .grupo-titulo {
    color: #94a3b8;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    margin: 0.5rem 1rem;
    text-transform: uppercase;
  }

  .grupo-nav {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .nav-item {
    align-items: flex-start;
    background: transparent;
    border: none;
    color: #cbd5e1;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem 1rem;
    text-align: left;
    transition: all 0.2s;
  }

  .nav-item:hover {
    background: #334155;
    color: #f1f5f9;
  }

  .nav-item.ativo {
    background: #0ea5e9;
    border-left: 3px solid #0284c7;
    color: #f8fafc;
  }

  .nav-item-titulo {
    font-size: 0.9rem;
    font-weight: 500;
  }

  .nav-item-desc {
    color: #94a3b8;
    font-size: 0.75rem;
  }

  .nav-item.ativo .nav-item-desc {
    color: #e0f2fe;
  }
</style>
