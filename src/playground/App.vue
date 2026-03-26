<script setup lang="ts">
import { UiButton } from '@/index'
</script>

<template>
  <main class="playground">
    <section class="hero">
      <p class="eyebrow">PrimeVue starter</p>
      <h1>Nuvem Bytecom UI</h1>
      <p class="copy">
        Base pronta para evoluir componentes compartilhados sobre PrimeVue, com build de biblioteca e tipagem.
      </p>
      <div class="actions">
        <UiButton label="Primary action" />
        <UiButton label="Secondary action" variant="secondary" />
      </div>
    </section>
  </main>
</template>

<style scoped>
.playground {
  align-items: center;
  background:
    radial-gradient(circle at top, rgba(56, 189, 248, 0.2), transparent 35%),
    linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
  display: grid;
  min-height: 100vh;
  padding: 2rem;
}

.hero {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 24px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
  margin: 0 auto;
  max-width: 720px;
  padding: 3rem;
}

.eyebrow {
  color: #0369a1;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin: 0 0 0.75rem;
  text-transform: uppercase;
}

h1 {
  color: #0f172a;
  font-size: clamp(2.5rem, 5vw, 4rem);
  line-height: 1;
  margin: 0;
}

.copy {
  color: #334155;
  font-size: 1.125rem;
  line-height: 1.6;
  margin: 1rem 0 0;
  max-width: 40ch;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
}
</style>