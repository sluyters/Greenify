<script setup lang="ts">
import type { EnergyProductionDay } from '@/types/EnergyProductionDay.type';
import IconCoal from './icons/electricity/IconCoal.vue';
import IconNuclearPlant from './icons/electricity/IconNuclearPlant.vue';
import IconSolar from './icons/electricity/IconSolar.vue';
import RatingLetterIcon from './RatingLetterIcon.vue';
import { computed } from 'vue';
import ProductionTypeIcon from './ProductionTypeIcon.vue';
import { useRouter } from 'vue-router';

// Properties
const props = defineProps<{
  data?: EnergyProductionDay
}>();

// Router
const router = useRouter();

// Computed properties
const dayString = computed(() => {
  if (props.data) {
    return props.data.date.toLocaleDateString(undefined, { weekday: 'long' })
  } else {
    return undefined;
  }
})
const dateString = computed(() => {
  if (props.data) {
    return props.data.date.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })
  } else {
    return undefined;
  }
});

// Functions
function onClick() {
  if (props.data) {
    router.push({ path: '/details', query: { id: props.data.id } });
  }
}
</script>

<template>
  <tr v-if="data" @click="onClick" class="w-full h-32 p-4 gap-16 border-b-2 last:border-b-0 border-slate-900 hover:bg-slate-900 transition-colors duration-200 cursor-pointer">
    <!-- <div v-if="data"> -->
      <!-- Date -->
      <th class="min-w-48 px-4 text-left">
        <div class="text-3xl text-slate-400">
          {{ dayString }}
        </div>
        <div class="text-2xl text-slate-300">
          {{ dateString }}
        </div>
      </th>

      <!-- Rating -->
      <td v-if="data" class="whitespace-nowrap px-4">
        <RatingLetterIcon :rating="data.productionScore" class="w-20 text-slate-300" />
      </td>

      <!-- Details -->
      <td v-if="data" class="w-[99%] px-4">
        <div class="flex flex-col justify-between gap-4">
          <div v-for="item, index in data.productionDetails.slice(0, 2)" :key="index" class="flex-none flex flex-row items-center gap-4">
            <!-- Icon -->
            <div class="flex-none w-8">
              <ProductionTypeIcon :type="item.name" class="text-white"/>
              <!-- <IconSolar /> -->
            </div>
            <!-- Percentage -->
            <div class="flex-auto h-3 bg-slate-500 rounded-md">
              <div class="h-full ms-0 bg-white rounded-md" :style="{ width: (item.power / data.totalPower) * 100 + '%'}"></div>
            </div>
          </div>
        </div>
      </td>
  </tr>

  <!-- Skeleton loader -->
  <tr v-else class="w-full h-32 p-4 gap-16 border-b-2 last:border-b-0 bg-slate-800 border-slate-900 transition-colors duration-200 animate-pulse">
    <!-- Date -->
    <th class="min-w-48 px-4">
      <div class="w-40 h-9 m-1 bg-slate-700 rounded-md"></div>
      <div class="w-20 h-8 m-1  bg-slate-700 rounded-md"></div>
    </th>
    <!-- Rating -->
    <td class="whitespace-nowrap px-4">
      <div class="w-20 h-20 p-1">
        <div class=" bg-slate-700 w-full h-full rounded-md"></div>
      </div>
    </td>
    <!-- Details -->
    <td class="w-[99%] px-4">
      <div class="flex flex-col justify-between gap-4">
        <div v-for="index in 2" :key="index" class="flex-none flex flex-row items-center gap-4">
          <!-- Icon -->
          <div class="flex-none h-8 w-8 bg-slate-700 rounded-md">
          </div>
          <!-- Percentage -->
          <div class="flex-auto h-3 bg-slate-700 rounded-md">
          </div>
        </div>
      </div>
    </td>
  </tr>
</template>