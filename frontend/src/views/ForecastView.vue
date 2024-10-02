<script setup lang="ts">
import DynamicBackground from '@/components/DynamicBackground.vue';
import MainRating from '@/components/MainRating.vue';
import RatingsList from '@/components/RatingsList.vue';
import { useFetch } from '@/composables/fetch';
import { useScrollDetection } from '@/composables/scroll';
import { getEnergyTheme } from '@/functions/energy-theme';
import type { EnergyProductionDay } from '@/types/EnergyProductionDay.type';
// import type { EnergyProductionDay } from '@/types/EnergyProductionDay.type';
import { computed, onMounted, ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';

// Options
defineOptions({
  inheritAttrs: false
});

// Router
const router = useRouter();

// Constants (TODO move to environment variables)
const API_URL = 'http://localhost';
const API_PORT = '4000';

// State
// const data = ref<EnergyProductionDay[]|undefined>();

// Composables
const scrolled = useScrollDetection();

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

</script>

<template>
    <div v-bind="$attrs">
      <DynamicBackground class="-z-50" :scrolled="scrolled" :theme="theme" />
      <div class="container mx-auto py-8 flex flex-col gap-8 z-0">
        <MainRating :data="reversedData ? reversedData[0] : undefined" @click-item="(date) => handleItemClick(date)" :scrolled="scrolled" :theme="theme" today/>
        <RatingsList :data="reversedData" @click-item="(date) => handleItemClick(date)"/>
      </div>
    </div>
</template>