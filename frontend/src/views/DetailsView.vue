<script setup lang="ts">
import BarPlot from '@/components/charts/BarPlot.vue';
import DynamicBackground from '@/components/DynamicBackground.vue';
import MainRating from '@/components/MainRating.vue';
import LineChart from '@/components/charts/LineChart.vue';
import ScalingLayout from '@/components/ScalingLayout.vue';
import { useFetch } from '@/composables/fetch';
import { useScrollDetection } from '@/composables/scroll';
import { getEnergyTheme } from '@/functions/energy-theme';
import { computed, effect, onMounted, ref, watch, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import StackedAreaChart from '@/components/charts/StackedAreaChart.vue';
import { parse } from 'vue/compiler-sfc';
import { getEnergyString } from '@/functions/energy-string';
import type { EnergyProductionDayDetail, PowerDetail, PriceDetail } from '@/types/EnergyProductionDay.type';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

// Options
defineOptions({
  inheritAttrs: false
});

// Constants (TODO move to environment variables)
const API_URL = 'http://192.168.178.77'; //'http://localhost';
const API_PORT = '4000';


// Router
const route = useRoute();

// CSS breakpoints
const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualSm = breakpoints.greaterOrEqual('sm')

// State
const fullscreen = ref(-1);
const headerCollapsed = ref(false);

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

// Functions
function handleHeaderCollapse(collapsed: boolean) {
  headerCollapsed.value = collapsed;
}

// Hooks
onMounted(() => {
  window.scrollTo(0, 0);
});
</script>

<template>
  <div v-bind="$attrs">
    <DynamicBackground class="-z-50" :scrolled="headerCollapsed" :theme="theme" />
    <ScalingLayout 
      class="w-full" 
      :header-collapse-ratio=".5"
      :scroll-offset="64" 
      :header-collapsed-height="96"
      :header-expanded-height="greaterOrEqualSm ? 512 : 256"
      @collapse="(e) => handleHeaderCollapse(e)"
    >
      <!-- Scalable header with the day's rating  -->
      <template #header>
        <MainRating 
          :data="data" 
          :collapsed="headerCollapsed" 
          :theme="theme" 
        />
      </template>
      <!-- Graphs -->
      <div v-if="data" class="w-full px-2 pb-2 sm:px-4 sm:pb-4">
        <div class="w-full flex flex-row flex-wrap gap-2 text-base text-white sm:container sm:mx-auto sm:gap-4 sm:text-2xl">
          <div class="flex-auto flex flex-col gap-2 w-full h-80 px-4 py-2 rounded-2xl bg-gray-700/70 sm:h-[32rem] sm:p-4" @click="() => fullscreen = 1">
            <div class="flex-none font-bold"> Evolution of the electricity cost and rating </div>
            <div class="flex-auto w-full h-full overflow-x-auto">
              <LineChart 
                class="min-w-[1200px]"
                :data="lineChartData"
              />
            </div>
          </div>
          <div class="flex-auto flex flex-col gap-2 w-full h-80 px-4 py-2 rounded-2xl bg-gray-700/70 sm:h-[32rem] sm:p-4">
            <div class="flex-none font-bold"> Evolution of the electricity mix </div>
            <div class="flex-auto w-full h-full overflow-x-auto">
              <StackedAreaChart 
                class="min-w-[1200px]" 
                :data="data.power"
              />      
            </div> 
          </div>
          <div class="flex-auto flex flex-col gap-2 w-full h-80 px-4 py-2 rounded-2xl bg-gray-700/70 sm:h-[32rem] sm:p-4">
            <div class="flex-none font-bold"> Average electricity mix </div>
            <div class="flex-auto w-full h-full overflow-x-auto">
              <BarPlot 
                class="min-w-[400px]" 
                :data="data.avgPower"
              />
            </div>
          </div>
        </div>
      </div>
    </ScalingLayout>
  </div>

</template>