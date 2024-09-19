<script setup lang="ts">
import RatingsList from '@/components/RatingsList.vue';
import RatingsListPagination from '@/components/RatingsListPagination.vue';
import { useFetch } from '@/composables/fetch';
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
const page = ref(0);
const limit = ref(7);

// Fetch data
const url = computed(() => `${API_URL}:${API_PORT}/api/archive?` + new URLSearchParams({
    page: page.value.toString(),
    limit: limit.value.toString(),
  }).toString());
const { data, headers, error } = useFetch(url);

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

function handleItemClick(id: number) {
  router.push({ path: '/details', query: { type: 'archive', id: id } });
}

// Hooks
onMounted(() => {
  window.scrollTo(0, 0);
});
</script>

<template>
  <div v-bind="$attrs">
    <div class="fixed -z-40 top-0 bottom-0 left-0 right-0 bg-black"></div>
    <div class="container mx-auto py-8">
      <RatingsList :data="data" :pagination="true" @click-item="(id) => handleItemClick(id)">
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
</template>