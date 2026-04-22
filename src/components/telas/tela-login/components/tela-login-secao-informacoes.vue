<template>
  <section class="hidden lg:flex flex-col justify-between bg-slate-900 text-white p-10">
    <div>
      <p class="text-xs uppercase tracking-[0.2em]">{{ titulo }}</p>
      <p class="text-sm text-slate-300 mt-4">
        {{ descricao }}
      </p>
    </div>
    <div class="text-xs text-slate-400">
      <p>{{ rodape }}</p>
    </div>
  </section>
</template>
<script lang="ts" setup>
  export type TelaLoginSecaoInformacoesProps = {
    titulo: string;
    descricao?: string;
    rodape?: string;
  };

  defineProps<TelaLoginSecaoInformacoesProps>();
</script>
