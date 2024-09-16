<script setup lang="ts">
import type { EnergyProductionDay } from '@/types/EnergyProductionDay.type';
import IconCoal from './icons/electricity/IconCoal.vue';
import IconNuclearPlant from './icons/electricity/IconNuclearPlant.vue';
import IconSolar from './icons/electricity/IconSolar.vue';
import RatingLetterIcon from './RatingLetterIcon.vue';
import { computed } from 'vue';
import ProductionTypeIcon from './ProductionTypeIcon.vue';
import { useRouter } from 'vue-router';
import type { EnergyProductionType } from '@/types/EnergyProductionType.type';

// Properties
interface Props {
  data: EnergyProductionDay;
}
const { data } = defineProps<Props>();

// Router
const router = useRouter();

// Computed properties
const sortedProductionDetails = computed(() => {
  if (data) {
    return data.productionDetails.slice().sort((a: EnergyProductionType, b: EnergyProductionType) => a.name.localeCompare(b.name))
  } else {
    return undefined;
  }
});
const dayString = computed(() => {
    return data.date.toLocaleDateString(undefined, { weekday: 'long' });
})
const dateString = computed(() => {
    return data.date.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' });
});

// Functions
function onClick() {
  router.push({ path: '/details', query: { id: data.id } });
}
</script>

<template>
  <tr class="w-full h-32 border-b-2  last:border-b-0 border-white/10 hover:bg-gray-700/80 transition-colors cursor-pointer text-white" @click="onClick">
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
      <RatingLetterIcon :rating="data.productionScore" class="w-20" />
    </td>

    <!-- Details -->
    <td v-if="data" class="w-[99%] px-8">
      <div class="flex flex-row flex-wrap justify-start gap-x-8 gap-y-4">
        <div v-for="item, index in sortedProductionDetails" :key="index" class="flex-none flex flex-row items-center gap-2">
          <!-- Icon -->
          <div class="flex-none h-8">
            <ProductionTypeIcon :type="item.name"/>
            <!-- <IconSolar /> -->
          </div>
          <!-- Percentage -->
          <div class="text-xl font-semibold">
            {{ Math.round(10 * 100 * item.power / data.totalPower) / 10 + '%' }}
          </div>
          <!-- <div class="flex-auto h-3 bg-slate-500 rounded-md">
            <div class="h-full ms-0 bg-white rounded-md" :style="{ width: (item.power / data.totalPower) * 100 + '%'}"></div>
          </div> -->
        </div>
      </div>
    </td>
  </tr>
</template>