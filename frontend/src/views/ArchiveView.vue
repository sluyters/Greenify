<script setup lang="ts">
import RatingsList from '@/components/RatingsList.vue';
import RatingsListPagination from '@/components/RatingsListPagination.vue';
import { useFetch } from '@/composables/fetch';
import type { EnergyProductionDay } from '@/types/EnergyProductionDay.type';
import { computed, onMounted, ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';

// Options
defineOptions({
  inheritAttrs: false
});

// Router
const router = useRouter();

// Constants (TODO move to environment variables)
const API_URL = 'http://192.168.178.77'; // 'http://localhost';
const API_PORT = '4000';

// State
const page = ref(0);
const limit = ref(7);

// Fetch data
const url = computed(() => `${API_URL}:${API_PORT}/api/actual?` + new URLSearchParams({
    page: page.value.toString(),
    limit: limit.value.toString(),
  }).toString());
const { data, headers, error }: { data: Ref<EnergyProductionDay[]>, headers: Ref<any>, error: Ref<any>} = useFetch(url);

// Computed
const itemsCount = computed(() => {
  if (headers.value && headers.value.has('X-Total-Count')) {
    const xTotalCount = headers.value.get('X-Total-Count');
    if (xTotalCount) {
      return Number.parseInt(xTotalCount);
    }
  }
  return limit.value;
});

// Functions
function handlePageChange(increment: number) {
  const maxPage = Math.ceil(itemsCount.value / limit.value) - 1;
  page.value = Math.min(Math.max(0, page.value + increment), maxPage);
  
}

function handleRowsPerPageChange(newValue: number) {
  page.value = 0;
  limit.value = newValue;
}

function handleItemClick(date: string) {
  router.push({ path: '/details', query: { type: 'actual', date: date } });
}

// Hooks
onMounted(() => {
  window.scrollTo(0, 0);
});
</script>

<template>
  <div v-bind="$attrs">
    <div class="fixed -z-40 top-0 h-screen left-0 right-0 bg-black"></div>
    <div class="w-full p-2 sm:p-4">
      <div class="w-full sm:container sm:mx-auto">
        <RatingsList :data="data" :pagination="true" @click-item="(date) => handleItemClick(date)">
          <template #header>
            <RatingsListPagination 
              :page="page" 
              :rowsPerPage="limit"
              :rowsCount="itemsCount"
              @page-change="(increment) => handlePageChange(increment)"
              @rows-per-page-change="(value) => handleRowsPerPageChange(value)"
            />
          </template>
        </RatingsList>
      </div>
    </div>
  </div>
</template>