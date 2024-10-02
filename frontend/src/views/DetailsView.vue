<script setup lang="ts">
import BarPlot from '@/components/charts/BarPlot.vue';
import DynamicBackground from '@/components/DynamicBackground.vue';
import MainRating from '@/components/MainRating.vue';
import LineChart from '@/components/charts/LineChart.vue';
import { useFetch } from '@/composables/fetch';
import { useScrollDetection } from '@/composables/scroll';
import { getEnergyTheme } from '@/functions/energy-theme';
import { computed, onMounted, ref, watch, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import StackedAreaChart from '@/components/charts/StackedAreaChart.vue';
import { parse } from 'vue/compiler-sfc';
import { getEnergyString } from '@/functions/energy-string';
import type { EnergyProductionDayDetail, PowerDetail, PriceDetail } from '@/types/EnergyProductionDay.type';

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
const url = computed(() => `${API_URL}:${API_PORT}/api/${query.value.type === 'forecast' ? 'forecast' : 'actual'}/${query.value.date || 'null'}`);
const { data, headers, error }: { data: Ref<EnergyProductionDayDetail>, headers: Ref<any>, error: Ref<any>} = useFetch(url);

// Computed
const theme = computed(() => {
  if (data.value) {
    return getEnergyTheme(data.value.score);
  } else {
    return -1;
  }
});

// const barPlotData = computed(() => {
//   let parsedData: { [key: string]: number } = {};
//   if (data.value) {
//     for (const { type, isForecast, power } of data.value.power) {
//       const energyString = getEnergyString(type);
//       if (Object.prototype.hasOwnProperty.call(parsedData, energyString)) {
//         parsedData[energyString] += power;
//       } else {
//         parsedData[energyString] = power;
//       }
//     }
//   }
//   return parsedData;
// })

const lineChartData = computed(() => {
  function groupByHour({ dateTime }: { dateTime: string}): string {
    let hourlyDateTime = new Date(dateTime);
    hourlyDateTime.setMinutes(0, 0, 0);
    return hourlyDateTime.toISOString(); 
  }
  if (data.value) {
    let groupedPower: {[key: string]: PowerDetail[]} = Object.groupBy(data.value.power, groupByHour);
    let parsedPower = Object.entries(groupedPower).map(([dateTime, group]) => {
      return {
        dateTime: new Date(dateTime),
        value: group.reduce((prev, powerDetail) => prev + (powerDetail.score / group.length), 0)
      };
    })
    let groupedPrice: {[key: string]: PriceDetail[]} = Object.groupBy(data.value.price, groupByHour);
    let parsedPrice = Object.entries(groupedPrice).map(([dateTime, group]) => {
      return {
        dateTime: new Date(dateTime),
        value: group.reduce((prev, priceDetail) => prev + (priceDetail.price / group.length), 0)
      };
    })
    console.log(parsedPower)
    return {
      price: parsedPrice,
      score: parsedPower
    };
  }
  return null;
});

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
          :data="lineChartData"
        />
      </div>
      <div class="flex-auto h-[32rem] w-full rounded-2xl bg-gray-700/70 flex flex-col">
        <div class="flex-none text-2xl text-white font-bold px-4 py-4"> Evolution of the electricity mix </div>
        <StackedAreaChart 
          class="flex-auto px-4 text-white overoverflow-x-auto scrollbar scrollbar-track-transparent scrollbar-thumb-white" 
          :data="data.power"
        />        
      </div>
      <div class="flex-auto h-[32rem] w-[28rem] rounded-2xl bg-gray-700/70 flex flex-col">
        <div class="text-2xl text-white font-bold px-4 py-4"> Average electricity mix </div>
        <BarPlot 
          class="flex-auto px-4 text-white" 
          :data="data.avgPower"
        />
      </div>
    </div>
    <!-- <div v-if="fullscreen !== -1" class="fixed inset-4 rounded-xl bg-black/70 backdrop-blur-md z-50" @click="() => fullscreen = -1">
      <LineChart class="text-white"/>
    </div> -->
  </div>
</template>