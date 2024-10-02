<script setup lang="ts">
import type { EnergyProductionDay } from '@/types/EnergyProductionDay.type';
import RatingLetterIcon from './RatingLetterIcon.vue';
import { computed } from 'vue';
import ProductionTypeIcon from './ProductionTypeIcon.vue';

// Properties
interface Props {
  data: EnergyProductionDay;
}
const { data } = defineProps<Props>();

// Computed properties
const date = computed(() => {
  return new Date(data.date);
});
// const sortedProductionDetails = computed(() => {
//   return data.avgPower.slice().sort((a: EnergyProductionType, b: EnergyProductionType) => a.type.localeCompare(b.type))
// });
const dayString = computed(() => {
    return date.value.toLocaleDateString(undefined, { weekday: 'long' });
})
const dateString = computed(() => {
    return date.value.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' });
});

</script>

<template>
  <tr class="w-full h-32 hover:bg-gray-700/80 transition-colors cursor-pointer text-white">
    <!-- Date -->
    <th class="min-w-48 px-4 text-left">
      <div class="text-3xl">
        {{ dayString }}
      </div>
      <div class="text-2xl">
        {{ dateString }}
      </div>
    </th>

    <!-- Rating -->
    <td v-if="data" class="whitespace-nowrap px-4">
      <RatingLetterIcon :rating="data.score" class="w-20" />
    </td>

    <!-- Details -->
    <td v-if="data" class="w-[99%] px-8">
      <div class="flex flex-row flex-wrap justify-start gap-x-8 gap-y-4">
        <div v-for="[type, power], index of Object.entries(data.avgPower)" :key="index" class="flex-none flex flex-row items-center gap-2" :class="{ 'text-white/20': power === 0 }">
          <!-- Icon -->
          <div class="flex-none h-8">
            <ProductionTypeIcon :type="type"/>
            <!-- <IconSolar /> -->
          </div>
          <!-- Percentage -->
          <div class="text-xl font-semibold">
            {{ Math.round(10 * 100 * power / data.totalPower) / 10 + '%' }}
          </div>
          <!-- <div class="flex-auto h-3 bg-slate-500 rounded-md">
            <div class="h-full ms-0 bg-white rounded-md" :style="{ width: (item.power / data.totalPower) * 100 + '%'}"></div>
          </div> -->
        </div>
      </div>
    </td>
  </tr>
</template>