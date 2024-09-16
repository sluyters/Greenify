<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import RatingLetterIcon from './RatingLetterIcon.vue';
import ProductionTypeIcon from './ProductionTypeIcon.vue';
import type { EnergyProductionDay } from '@/types/EnergyProductionDay.type';

// Properties
const props = defineProps<{
  data?: EnergyProductionDay
}>();

// Router
const router = useRouter();

// State
const scrollPosition = ref(0);

// Computed properties
const changeColor = computed(() => scrollPosition.value > 100 ? true : false);
const dayString = computed(() => {
  if (props.data) {
    return props.data.date.toLocaleDateString(undefined, { weekday: 'long' })
  } else {
    return undefined;
  }
})
const dateString = computed(() => {
  if (props.data) {
    return props.data.date.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })
  } else {
    return undefined;
  }
});

// Functions
function updateScroll() {
  scrollPosition.value = window.scrollY;
}

function onClick() {
  if (props.data) {
    router.push({ path: '/details', query: { id: props.data.id } });
  }
}

// Hooks
onMounted(() => {
  window.addEventListener('scroll', updateScroll);
});
</script>

<template>
  <div
    v-if="data"
    @click="onClick" 
    class="group flex rounded-2xl cursor-pointer bg-black/20 backdrop-blur-md border-slate-700 w-full transition-colors duration-500 text-white h-64 p-4 gap-4" 
    :class="{ 'bg-transparent': changeColor, 'hover:duration-200 hover:bg-transparent hover:border': !changeColor }"
  >
    <!-- Rating -->
    <div class="flex-none h-full flex rounded-xl bg-slate-900 duration-500" :class="{'bg-transparent scale-110': changeColor, 'group-hover:bg-slate-800': !changeColor }">
      <RatingLetterIcon :rating=".9" class="w-full h-full text-slate-300"/>
      <!-- <IconLetterA /> -->
    </div>
    <!-- Details -->
    <div class="flex-1 flex flex-col justify-around">
      <div class="font-bold mb-4">
        <div class="text-6xl text-slate-400">Today</div>
        <div class="text-4xl text-slate-300">{{ dateString }}</div>
      </div>
      <div class="flex flex-col justify-between gap-4">
        <div v-for="item, index in data.productionDetails.slice(0, 2)" :key="index" class="flex-none flex flex-row items-center gap-4">
          <!-- Icon -->
          <div class="flex-none w-8">
            <ProductionTypeIcon :type="item.name" class="text-white"/>
            <!-- <IconSolar /> -->
          </div>
          <!-- Percentage -->
          <div class="flex-auto h-3 bg-slate-500 rounded-md">
            <div class="h-full ms-0 bg-white rounded-md" :style="{ width: (item.power / data.totalPower) * 100 + '%'}"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Skeleton loader -->
  <div
    v-else
    class="rounded-2xl bg-slate-800 w-full text-white h-64 p-4"
  >
    <div class="flex w-full h-full gap-4 animate-pulse">
      <!-- Rating -->
      <div class="flex-none h-full flex rounded-xl bg-slate-700">
        <RatingLetterIcon :rating="1.0" class="w-full h-full text-transparent"/>
      </div>
      <!-- Details -->
      <div class="flex-1 flex flex-col justify-around">
        <div class="mb-4">
          <div class="w-64 h-14 bg-slate-700 rounded-md mb-2"></div>
          <div class="w-32 h-9 bg-slate-700 rounded-md"></div>
          <!-- <div class="text-6xl text-slate-400">Today</div>
          <div class="text-4xl text-slate-300">{{ dateString }}</div> -->
        </div>
        <div class="flex flex-col justify-between gap-4">
          <div v-for="index in 2" :key="index" class="flex-none flex flex-row items-center gap-4">
            <!-- Icon -->
            <div class="flex-none h-8 w-8 bg-slate-700 rounded-md">
            </div>
            <!-- Percentage -->
            <div class="flex-auto h-3 bg-slate-700 rounded-md">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>