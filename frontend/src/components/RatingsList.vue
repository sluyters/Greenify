<script setup lang="ts">
import type { EnergyProductionDay } from '@/types/EnergyProductionDay.type';
import RatingsListItemLoader from './loaders/RatingsListItemLoader.vue';
import RatingsListItem from './RatingsListItem.vue';

// Properties
interface Props {
  data?: EnergyProductionDay[];
}
const { data = undefined } = defineProps<Props>();
</script>

<template>
  <table class="w-full border-collapse overflow-hidden rounded-2xl bg-gray-700/70">
    <Transition
      enter-active-class="transition-opacity duration-150"
      leave-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
      mode="out-in"
    >
      <tbody v-if="data">
        <RatingsListItem v-for="item in data" :key="item.id" :data="item"/>
      </tbody>
      <tbody v-else>
        <RatingsListItemLoader v-for="index in 7" :key="index"/>
      </tbody>
    </Transition>
  </table>
</template>