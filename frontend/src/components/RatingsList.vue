<script setup lang="ts">
import type { EnergyProductionDay } from '@/types/EnergyProductionDay.type';
import RatingsListItemLoader from './loaders/RatingsListItemLoader.vue';
import RatingsListItem from './RatingsListItem.vue';

// Emits
const emit = defineEmits(['click-item']);

// Properties
interface Props {
  data?: EnergyProductionDay[] | null;
}
const { data = null } = defineProps<Props>();

</script>

<template>
  <table class="w-full border-collapse overflow-hidden rounded-2xl bg-gray-700/70">
    <thead v-if="$slots.header">
      <slot name="header"></slot>
    </thead>
    <Transition
      enter-active-class="transition-opacity duration-150"
      leave-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
      mode="out-in"
    >
      <tbody v-if="data">
        <RatingsListItem v-for="(item, index) in data" :key="index" :data="item"
          class="border-b-2 border-white/10" 
          :class="{ 'last:border-b-0': !$slots.footer, 'first:border-t-2': $slots.header }"
          @click="$emit('click-item', item.date)"
        />
      </tbody>
      <tbody v-else>
        <RatingsListItemLoader v-for="index in 7" :key="index"
          class="border-b-2 border-white/10" 
          :class="{ 'last:border-b-0': !$slots.footer }"
        />
      </tbody>
    </Transition>
    <tfoot v-if="$slots.footer">
      <slot name="footer"></slot>
    </tfoot>
  </table>
</template>