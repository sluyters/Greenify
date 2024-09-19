<script setup lang="ts">
import DynamicBackground from '@/components/DynamicBackground.vue';
import MainRating from '@/components/MainRating.vue';
import RatingsList from '@/components/RatingsList.vue';
import { useFetch } from '@/composables/fetch';
import { useScrollDetection } from '@/composables/scroll';
import { getEnergyTheme } from '@/functions/energy-theme';
// import type { EnergyProductionDay } from '@/types/EnergyProductionDay.type';
import { computed, onMounted, ref } from 'vue';
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
const { data, headers, error } = useFetch(url);

// Computed
const theme = computed(() => {
  if (data.value && data.value[0]) {
    return getEnergyTheme(data.value[0].productionScore);
  } else {
    return -1;
  }
});

// Functions
function handleItemClick(id: number) {
  router.push({ path: '/details', query: { type: 'forecast', id: id } });
}

</script>

<template>
    <div v-bind="$attrs">
      <DynamicBackground class="-z-50" :scrolled="scrolled" :theme="theme" />
      <div class="container mx-auto py-8 flex flex-col gap-8 z-0">
        <MainRating :data="data ? data[0] : undefined" @click-item="(id) => handleItemClick(id)" :scrolled="scrolled" :theme="theme" today/>
        <RatingsList :data="data" @click-item="(id) => handleItemClick(id)"/>
      </div>
    </div>
</template>