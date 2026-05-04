<template>
  <Dialog :header="titulo" modal v-model:visible="visivel" class="min-w-125!">
    <SelectEmpresa v-model="empresaInterna" />
    <DataTable :value="empresasParaMostrar" class="mt-3">
      <template #empty>
        <NenhumConteudoEncontrado mensagem="Nenhuma empresa adicionada" />
      </template>
      <Column header="Empresa">
        <template #body="{ data }">
          <div class="flex gap-3 items-center">
            <div class="p-1">
              <img
                :src="data.empresa.logo"
                alt="Logo da Empresa"
                class="size-10"
                v-if="data.empresa.logo"
              />
              <Avatar
                :label="data.empresa.nomeRazao.at(0)"
                class="size-10! text-lg!"
                shape="circle"
                v-else
              />
            </div>
            <div>
              <p>{{ data.empresa.nomeRazao }}</p>
              <p
                v-if="data.empresa.nomeFantasia !== data.empresa.nomeRazao"
                class="text-sm text-gray-400"
              >
                {{ data.empresa.nomeFantasia }}
              </p>
            </div>
          </div>
        </template>
      </Column>
      <Column>
        <template #body="{ data }">
          <Button
            icon="pi pi-times"
            text
            severity="danger"
            @click="confirmarRemoverEmpresa($event, data)"
          />
        </template>
      </Column>
    </DataTable>
  </Dialog>
</template>
<script lang="ts" setup>
import NenhumConteudoEncontrado from '@/components/nenhum-conteudo-encontrado.vue';
import SelectEmpresa from '@/components/selects/select-empresa.vue';
import useNotification from '@/composables/use-notification';
import { Empresa } from '@/types/modelos/empresa';
import { PessoaEmpresa } from '@/types/modelos/pessoa-empresa';
import { Avatar, Button, Column, DataTable, Dialog } from 'primevue';
import { useConfirm } from 'primevue/useconfirm';
import { useFieldArray } from 'vee-validate';
import { computed, nextTick, ref, watch } from 'vue';

const { paraAdicionarKey, paraRemoverKey, titulo, empresas } = defineProps<{
  paraAdicionarKey: string;
  paraRemoverKey: string;
  titulo: string;
  empresas?: PessoaEmpresa[];
}>();

const visivel = defineModel<boolean>('visivel', {
  required: true,
});

const {
  fields: paraAdicionarFields,
  push: paraAdicionarPush,
  remove: paraAdicionarRemove,
} = useFieldArray<Empresa>(paraAdicionarKey);

const {
  fields: paraRemoverFields,
  push: paraRemoverPush,
  remove: paraRemoverRemove,
} = useFieldArray<Empresa>(paraRemoverKey);

const empresaInterna = ref<Empresa>();
const confirm = useConfirm();

const { aviso } = useNotification();

watch(empresaInterna, () => {
  nextTick(() => {
    if (visivel.value && empresaInterna.value) {
      const empresaParaRemoverIndex = paraRemoverFields.value.findIndex(
        (empresa) => empresa.value.id === empresaInterna.value?.id
      );

      if (empresaParaRemoverIndex >= 0) {
        paraRemoverRemove(empresaParaRemoverIndex);
      } else {
        const empresaJaAdicionada = paraAdicionarFields.value.some(
          (empresa) => empresa.value.id === empresaInterna.value?.id
        );

        if (empresaJaAdicionada) {
          aviso('Empresa já adicionada');
        } else {
          paraAdicionarPush(empresaInterna.value);
        }
      }

      empresaInterna.value = undefined;
    }
  });
});

type EmpresaParaMostrar = {
  index?: number;
  empresa: Empresa;
};

const empresasParaMostrar = computed(() => {
  const empresasExistentes = (empresas || [])
    .filter(({ empresaId }) => {
      const empresaParaRemover = paraRemoverFields.value.some(
        (empresa) => empresa.value.id === empresaId
      );

      return !empresaParaRemover;
    })
    .map<EmpresaParaMostrar>(({ empresa }) => ({
      empresa,
    }));

  const empresasTratadas = paraAdicionarFields.value.map<EmpresaParaMostrar>((field, index) => ({
    empresa: field.value,
    index,
  }));

  return empresasTratadas.concat(empresasExistentes);
});

const removerEmpresa = ({ empresa, index }: EmpresaParaMostrar) => {
  if (empresasParaMostrar.value.length === 1) {
    return aviso('É preciso ter ao menos uma empresa adicionada');
  }

  if (typeof index === 'number') {
    paraAdicionarRemove(index);
  } else {
    paraRemoverPush(empresa);
  }
};

const confirmarRemoverEmpresa = (event: Event, empresaParaMostrar: EmpresaParaMostrar) => {
  if (empresasParaMostrar.value.length === 1) {
    return aviso('É preciso ter ao menos uma empresa adicionada');
  }

  confirm.require({
    target: event.currentTarget as HTMLElement,
    header: 'Remover empresa?',
    message: `Deseja realmente remover ${empresaParaMostrar.empresa.nomeRazao}?`,
    acceptLabel: 'Remover',
    acceptProps: {
      severity: 'danger',
    },
    rejectLabel: 'Cancelar',
    rejectProps: {
      severity: 'secondary',
    },
    accept: () => removerEmpresa(empresaParaMostrar),
  });
};
</script>
