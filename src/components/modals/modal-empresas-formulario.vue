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
      <Column v-if="empresaIdsComPermissaoTabelaPreco?.length" header="Tabela de preço">
        <template #body="{ data }">
          <div class="w-56">
            <SelectTabelaPreco
              v-if="empresaIdsComPermissaoSet.has(data.empresa.id)"
              v-model="fields[data.index].value.tabelaPrecoId"
              :empresa-id="data.empresa.id"
            />
            <span v-else class="text-gray-400">—</span>
          </div>
        </template>
      </Column>
      <Column header="Pode comprar">
        <template #body="{ data }">
          <div v-if="empresaIdsComPermissaoSet.has(data.empresa.id)" class="flex justify-center">
            <Checkbox
              v-model="fields[data.index].value.podeComprar"
              binary
            />
          </div>
          <div v-else class="flex justify-center">
            <Tag
              :value="fields[data.index].value.podeComprar ? 'Sim' : 'Não'"
              :severity="fields[data.index].value.podeComprar ? 'success' : 'danger'"
            />
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
import SelectTabelaPreco from '@/components/selects/select-tabela-preco.vue';
import useNotification from '@/composables/use-notification';
import { Empresa } from '@/types/modelos/empresa';
import { Avatar, Button, Checkbox, Column, DataTable, Dialog, Tag } from 'primevue';
import { useConfirm } from 'primevue/useconfirm';
import { useFieldArray } from 'vee-validate';
import { computed, nextTick, ref, watch } from 'vue';

const { empresasKey, paraRemoverKey, titulo, empresaIdsOriginais, empresaIdsComPermissaoTabelaPreco } =
  defineProps<{
    empresasKey: string;
    paraRemoverKey: string;
    titulo: string;
    empresaIdsOriginais?: Set<number>;
    empresaIdsComPermissaoTabelaPreco?: number[];
  }>();

const empresaIdsComPermissaoSet = computed(() => new Set(empresaIdsComPermissaoTabelaPreco));

const visivel = defineModel<boolean>('visivel', {
  required: true,
});

type EmpresaFormulario = Empresa & { tabelaPrecoId?: number | null; podeComprar?: boolean };

const { fields, push, remove } = useFieldArray<EmpresaFormulario>(empresasKey);

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
      const id = empresaInterna.value.id;

      const indexParaRemover = paraRemoverFields.value.findIndex((f) => f.value.id === id);

      if (indexParaRemover >= 0) {
        paraRemoverRemove(indexParaRemover);
      } else {
        const jaExiste = fields.value.some((f) => f.value.id === id);

        if (jaExiste) {
          aviso('Empresa já adicionada');
        } else {
          push({ ...empresaInterna.value, tabelaPrecoId: null, podeComprar: false });
        }
      }

      empresaInterna.value = undefined;
    }
  });
});

type EmpresaParaMostrar = {
  index: number;
  empresa: Empresa;
};

const empresasParaMostrar = computed(() =>
  fields.value
    .filter((f) => !paraRemoverFields.value.some((r) => r.value.id === f.value.id))
    .map<EmpresaParaMostrar>((f, i) => ({ empresa: f.value, index: i }))
);

const removerEmpresa = ({ empresa, index }: EmpresaParaMostrar) => {
  if (empresasParaMostrar.value.length === 1) {
    return aviso('É preciso ter ao menos uma empresa adicionada');
  }

  if (empresaIdsOriginais?.has(empresa.id)) {
    paraRemoverPush(empresa);
  } else {
    remove(index);
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
