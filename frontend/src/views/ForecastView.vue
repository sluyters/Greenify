<script setup lang="ts">
import DynamicBackground from '@/components/DynamicBackground.vue';
import MainRating from '@/components/MainRating.vue';
import RatingsList from '@/components/RatingsList.vue';
import ScalingLayout from '@/components/ScalingLayout.vue';
import { useFetch } from '@/composables/fetch';
import { useScrollDetection } from '@/composables/scroll';
import { getEnergyTheme } from '@/functions/energy-theme';
import type { EnergyProductionDay } from '@/types/EnergyProductionDay.type';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
// import type { EnergyProductionDay } from '@/types/EnergyProductionDay.type';
import { computed, onMounted, ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';

// Options
defineOptions({
  inheritAttrs: false
});

// Router
const router = useRouter();

// CSS breakpoints
const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualSm = breakpoints.greaterOrEqual('sm')

// Constants (TODO move to environment variables)
const API_URL = 'http://192.168.178.77';//'http://localhost';
const API_PORT = '4000';

// State
// const data = ref<EnergyProductionDay[]|undefined>();
const headerCollapsed = ref(false);

// Fetch data
const url = computed(() => `${API_URL}:${API_PORT}/api/forecast`);
const { data, headers, error }: { data: Ref<EnergyProductionDay[]>, headers: Ref<any>, error: Ref<any>} = useFetch(url);

// Computed
const reversedData = computed(() => {
  return data.value ? data.value.slice().reverse() : data.value;
});
const theme = computed(() => {
  if (reversedData.value && reversedData.value[0]) {
    return getEnergyTheme(reversedData.value[0].score);
  } else {
    return -1;
  }
});

// Functions
function handleItemClick(date: string) {
  router.push({ path: '/details', query: { type: 'forecast', date: date } });
}

function handleHeaderCollapse(collapsed: boolean) {
  headerCollapsed.value = collapsed;
}

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
        <!-- Scalable header with today's rating  -->
        <template #header>
          <MainRating 
            :data="reversedData ? reversedData[0] : undefined" 
            @click-item="(date) => handleItemClick(date)" 
            :collapsed="headerCollapsed" 
            :theme="theme" 
            today 
          />
        </template>
        <!-- Weekly forecast -->
        <div class="w-full px-2 pb-2 sm:px-4 sm:pb-4">
          <div class="w-full sm:container sm:mx-auto">
            <RatingsList :data="reversedData" @click-item="(date) => handleItemClick(date)" />
          </div>
        </div>
      </ScalingLayout>
    </div>
</template>