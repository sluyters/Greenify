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
  <tr class="w-full h-16">
    <td colspan="100%" class="px-4">
      <div class="flex flex-row justify-between">
        <!-- Select number of results per page -->
        <div class="flex-initial flex flex-row gap-2">
          <label for="rows-per-page" class="flex-initial px-2 text-xl text-white">Rows per page:</label>
          <select
            @change="onSelectNumRows($event)"
            :value="rowsPerPage"
            name="rows-per-page" 
            class="flex-initial h-8"
          >
            <option value="7">7</option>
            <option value="14">14</option>
            <option value="28">28</option>
          </select>
        </div>
        <!-- Change page -->
        <div class="flex-initial flex flex-row gap-2">
          <div class="flex-initial h-8 px-2 text-xl text-white items-center">
            {{ rowsDisplayed }} of {{ rowsCount }}
          </div>
          <button
            @click="$emit('page-change', -5)"
            class="flex-initial border border-white/10 bg-gray-600/20 w-10 h-8 rounded-md hover:bg-gray-500/20"
          >
            <ChevronDoubleLeftIcon class="size-6 m-auto text-white"></ChevronDoubleLeftIcon>
          </button>
          <button
            @click="$emit('page-change', -1)"
            class="flex-initial border border-white/10 bg-gray-600/20 w-10 h-8 rounded-md hover:bg-gray-500/20"
          >
            <ChevronLeftIcon class="size-6 m-auto text-white"></ChevronLeftIcon>
          </button>
          <button
            @click="$emit('page-change', 1)" 
            class="flex-initial border border-white/10 bg-gray-600/20 w-10 h-8 rounded-md hover:bg-gray-500/20"
          >
            <ChevronRightIcon class="size-6 m-auto text-white"></ChevronRightIcon>
          </button>
          <button
            @click="$emit('page-change', 5)" 
            class="flex-initial border border-white/10 bg-gray-600/20 w-10 h-8 rounded-md hover:bg-gray-500/20"
          >
            <ChevronDoubleRightIcon class="size-6 m-auto text-white"></ChevronDoubleRightIcon>
          </button>
        </div>
      </div>
    </td>
  </tr>
</template>