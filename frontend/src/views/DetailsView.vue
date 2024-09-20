<script setup lang="ts">
import DynamicBackground from '@/components/DynamicBackground.vue';
import MainRating from '@/components/MainRating.vue';
import { useFetch } from '@/composables/fetch';
import { useScrollDetection } from '@/composables/scroll';
import { getEnergyTheme } from '@/functions/energy-theme';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

// Options
defineOptions({
  inheritAttrs: false
});

// Constants (TODO move to environment variables)
const API_URL = 'http://localhost';
const API_PORT = '4000';

// Router
const route = useRoute();

// Computed
const theme = computed(() => {
  if (data.value) {
    return getEnergyTheme(data.value.score);
  } else {
    return -1;
  }
});

const query = computed(() => route.query);

// Composables
const scrolled = useScrollDetection();

// Fetch data
const url = computed(() => `${API_URL}:${API_PORT}/api/${query.value.type ? 'forecast' : 'archive'}/${query.value.id?.toString() || '-1'}`);
const { data, headers, error } = useFetch(url);

// Hooks
onMounted(() => {
  window.scrollTo(0, 0);
});
</script>

<template>
  <div v-bind="$attrs">
    <DynamicBackground class="-z-50" :scrolled="scrolled" :theme="theme" />
    <div class="container mx-auto py-8 flex flex-col gap-8 z-0">
      <MainRating :data="data" :scrolled="scrolled" :theme="theme"/>
      <div class="h-[70rem] rounded-2xl bg-gray-700/70">
        More details
      </div>
    </div>
  </div>
</template>