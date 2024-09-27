<script setup lang="ts">
import BarPlot from '@/components/charts/BarPlot.vue';
import DynamicBackground from '@/components/DynamicBackground.vue';
import MainRating from '@/components/MainRating.vue';
import LineChart from '@/components/charts/LineChart.vue';
import { useFetch } from '@/composables/fetch';
import { useScrollDetection } from '@/composables/scroll';
import { getEnergyTheme } from '@/functions/energy-theme';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import StackedAreaChart from '@/components/charts/StackedAreaChart.vue';
import { parse } from 'vue/compiler-sfc';
import { getEnergyString } from '@/functions/energy-string';

// Options
defineOptions({
  inheritAttrs: false
});

// Constants (TODO move to environment variables)
const API_URL = 'http://localhost';
const API_PORT = '4000';


// Router
const route = useRoute();

// State
const fullscreen = ref(-1);

// Composables
const scrolled = useScrollDetection();

// Fetch data
const query = computed(() => route.query);
const url = computed(() => `${API_URL}:${API_PORT}/api/${query.value.type ? 'forecast' : 'archive'}/${query.value.id?.toString() || '-1'}`);
const { data, headers, error } = useFetch(url);

// Computed
const theme = computed(() => {
  if (data.value) {
    return getEnergyTheme(data.value.score);
  } else {
    return -1;
  }
});

const barPlotData = computed(() => {
  let parsedData: { [key: string]: number } = {};
  if (data.value) {
    for (const { type, isForecast, power } of data.value.productionDetails) {
      const energyString = getEnergyString(type);
      if (Object.prototype.hasOwnProperty.call(parsedData, energyString)) {
        parsedData[energyString] += power;
      } else {
        parsedData[energyString] = power;
      }
    }
  }
  return parsedData;
})


// Hooks
onMounted(() => {
  window.scrollTo(0, 0);
});
</script>

<template>
  <div v-bind="$attrs" :class="{ 'overflow-hidden h-screen': fullscreen !== -1 }">
    <DynamicBackground class="-z-50" :scrolled="scrolled" :theme="theme" />
    <!-- Switch to grid with breakpoints to handle other devices? -->
    <div class="container mx-auto py-8 flex flex-row gap-8 z-0 flex-wrap">
      <MainRating class="flex-none w-full" :data="data" :scrolled="scrolled" :theme="theme"/>
      <div class="flex-auto flex-shrink-0 h-[32rem] w-full rounded-2xl bg-gray-700/70 flex flex-col" @click="() => fullscreen = 1">
        <div class="text-2xl text-white font-bold px-4 py-4"> Evolution of the electricity cost and rating </div>
        <LineChart 
          class="flex-auto px-4 text-white overflow-x-auto"
        />
      </div>
      <div class="flex-auto h-[32rem] w-full rounded-2xl bg-gray-700/70 flex flex-col">
        <div class="flex-none text-2xl text-white font-bold px-4 py-4"> Evolution of the electricity mix </div>
        <StackedAreaChart 
          class="flex-auto px-4 text-white overoverflow-x-auto scrollbar scrollbar-track-transparent scrollbar-thumb-white" 
        />
      </div>
      <div class="flex-auto h-[32rem] w-[28rem] rounded-2xl bg-gray-700/70 flex flex-col">
        <div class="text-2xl text-white font-bold px-4 py-4"> Average electricity mix </div>
        <BarPlot 
          class="flex-auto px-4 text-white" 
          :data="barPlotData"
        />
      </div>
    </div>
    <div v-if="fullscreen !== -1" class="fixed inset-4 rounded-xl bg-black/70 backdrop-blur-md z-50" @click="() => fullscreen = -1">
      <LineChart class="text-white"/>
    </div>
  </div>
</template>