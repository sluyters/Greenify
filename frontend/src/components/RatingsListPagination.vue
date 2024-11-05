<script setup lang="ts">
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';
import { computed } from 'vue';

// Emits
const emit = defineEmits(['page-change', 'rows-per-page-change']);

// Props
interface Props {
  page?: number;
  rowsPerPage?: number;
  rowsCount?: number;
}
const { page = 1, rowsPerPage = 7, rowsCount = 16 } = defineProps<Props>();

// Computed
const maxPage = computed(() => {
  return Math.ceil(rowsCount / rowsPerPage) - 1;
});
const rowsDisplayed = computed(() => {
  if (page === maxPage.value) { // Last page
    if (rowsCount % rowsPerPage === 1) {
      return `${(page * rowsPerPage) + 1}`;
    } else {
      return `${(page * rowsPerPage) + 1}-${rowsCount}`;
    }
  } else {  // Any other page
    return `${(page * rowsPerPage) + 1}-${(page + 1) * rowsPerPage}`;
  }
});

// Functions
function onSelectNumRows(event) {
  if (event.target) {
    emit('rows-per-page-change', Number.parseInt(event.target.value));
  }
}

</script>

<template>
  <tr class="w-full">
    <td colspan="100%" class="p-2 text-sm sm:p-4 sm:text-xl">
      <div class="flex flex-col items-center justify-between max-sm:gap-2 sm:flex-row">
        <!-- Select number of results per page -->
        <div class="flex-initial flex flex-row items-center gap-1 sm:gap-2">
          <label for="rows-per-page" class="flex-auto px-2 text-white font-semibold sm:text-xl">Rows per page:</label>
          <select
            @change="onSelectNumRows($event)"
            :value="rowsPerPage"
            name="rows-per-page" 
            class="flex-initial h-8 w-10 border border-white/10 bg-gray-600/20 rounded-md text-white hover:bg-gray-500/20"
          >
            <option value="7" class="text-black">7</option>
            <option value="14" class="text-black">14</option>
            <option value="28" class="text-black">28</option>
          </select>
        </div>
        <!-- Change page -->
        <div class="flex-initial flex flex-row items-center gap-1 sm:gap-2">
          <button
            @click="$emit('page-change', -5)"
            class="flex-initial w-10 h-8 border border-white/10 bg-gray-600/20 rounded-md hover:bg-gray-500/20"
          >
            <ChevronDoubleLeftIcon class="size-6 m-auto text-white"></ChevronDoubleLeftIcon>
          </button>
          <button
            @click="$emit('page-change', -1)"
            class="flex-initial w-10 h-8 border border-white/10 bg-gray-600/20 rounded-md hover:bg-gray-500/20"
          >
            <ChevronLeftIcon class="size-6 m-auto text-white"></ChevronLeftIcon>
          </button>
          <div class="flex-initial px-2 text-white">
            {{ rowsDisplayed }} of {{ rowsCount }}
          </div>
          <button
            @click="$emit('page-change', 1)" 
            class="flex-initial w-10 h-8 border border-white/10 bg-gray-600/20 rounded-md hover:bg-gray-500/20"
          >
            <ChevronRightIcon class="size-6 m-auto text-white"></ChevronRightIcon>
          </button>
          <button
            @click="$emit('page-change', 5)" 
            class="flex-initial w-10 h-8 border border-white/10 bg-gray-600/20 rounded-md hover:bg-gray-500/20"
          >
            <ChevronDoubleRightIcon class="size-6 m-auto text-white"></ChevronDoubleRightIcon>
          </button>
        </div>
      </div>
    </td>
  </tr>
</template>