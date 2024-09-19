<script setup lang="ts">
import RatingLetterIcon from '../RatingLetterIcon.vue';
import ProductionTypeIcon from '../ProductionTypeIcon.vue';
</script>

<template>
  <tr class="w-full h-32 p-4 gap-16 transition-colors animate-pulse">
    <!-- Date -->
    <th class="min-w-48 px-4">
      <div class="w-40 h-9 my-2 bg-white/20 rounded-xl"></div>
      <div class="w-20 h-8 my-2 bg-white/20 rounded-xl"></div>
    </th>
    <!-- Rating -->
    <td class="whitespace-nowrap px-4">
      <div class="w-20 h-20">
        <div class=" bg-white/20 w-full h-full rounded-[50%]"></div>
      </div>
    </td>
    <!-- Details -->
    <td class="w-[99%] px-8">
      <div class="flex flex-col justify-between gap-x-8 gap-y-4">
        <div class="w-full h-8 bg-white/20 rounded-xl"></div>
        <div class="w-1/5 h-8 bg-white/20 rounded-xl"></div>
      </div>
    </td>
  </tr>
</template>