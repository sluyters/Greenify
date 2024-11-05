<script setup lang="ts">
import RatingLetterIcon from '../RatingLetterIcon.vue';
import ProductionTypeIcon from '../ProductionTypeIcon.vue';
</script>

<template>
  <tr class="w-full h-fit gap-16 transition-colors animate-pulse">
    <!-- Date -->
    <th class="min-w-24 px-2 py-2 sm:min-w-48 sm:px-4">
      <div class="w-20 h-4 my-2 bg-white/20 rounded-lg sm:w-40 sm:h-8"></div>
      <div class="w-10 h-4 my-2 bg-white/20 rounded-lg sm:w-20 sm:h-8"></div>
    </th>
    <!-- Rating -->
    <td class="whitespace-nowrap px-2 py-2 sm:px-4">
      <div class="w-12 h-12 sm:w-20 sm:h-20">
        <div class=" bg-white/20 w-full h-full rounded-full"></div>
      </div>
    </td>
    <!-- Details -->
    <td class="w-[99%] p-2 sm:px-4">
      <div class="flex flex-row flex-wrap justify-start gap-y-2">
        <div class="flex-none w-full h-4 bg-white/20 rounded-lg sm:h-8"></div>
        <div class="flex-none w-full h-4 bg-white/20 rounded-lg sm:h-8 sm:hidden"></div>
        <div class="flex-none w-1/2 h-4 bg-white/20 rounded-lg sm:w-1/5 sm:h-8"></div>
      </div>
    </td>
  </tr>
</template>