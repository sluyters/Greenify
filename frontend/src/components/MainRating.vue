<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import RatingLetterIcon from './RatingLetterIcon.vue';
import type { EnergyProductionDay } from '@/types/EnergyProductionDay.type';

// Emits
const emit = defineEmits(['click-item']);

// Properties
interface Props {
  today?: boolean;
  scrolled?: boolean;
  theme?: number;
  data?: EnergyProductionDay | null;
}
const { data = null, theme = -1, scrolled = false, today = false } = defineProps<Props>();

// Router
const router = useRouter();

// Computed properties
const ratingDescription = computed(() => {
  if (!data) {
    return '';
  } else if (data.productionScore < 1 / 7) {
    return 'Terrible';
  } else if (data.productionScore < 2 / 7) {
    return 'Poor';
  } else if (data.productionScore < 3 / 7) {
    return 'Mediocre';
  } else if (data.productionScore < 4 / 7) {
    return 'Average';
  } else if (data.productionScore < 5 / 7) {
    return 'Good';
  } else if (data.productionScore < 6 / 7) {
    return 'Very good';
  } else {
    return 'Excellent';
  }
});
const imgSrc = computed(() => {
  switch(theme) {
    case 0:
      return 'background/energy-good-2.jpg';
    case 1: 
      return 'background/energy-medium.jpg';
    case 2: 
      return 'background/energy-bad.jpg';
    default:
      return '';
  }
});
// const dayString = computed(() => {
//   if (data) {
//     return data.date.toLocaleDateString(undefined, { weekday: 'long' });
//   } else {
//     return undefined;
//   }
// })
const dateString = computed(() => {
  if (data) {
    const date = new Date(data.date);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } else {
    return undefined;
  }
});

// Functions
function onClick() {
  if (data) {
    emit('click-item', data.id);
    // router.push({ path: '/details', query: { id: data.id } });
  }
}
</script>

<template>
  <div 
    class="group h-[28rem] w-full rounded-2xl overflow-hidden transition-colors" 
    :class="{ 'bg-transparent duration-500': scrolled && data, 'bg-gray-700/70': !scrolled }"
  >
    <Transition
      enter-active-class="transition-opacity duration-150"
      leave-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
      mode="out-in"
    >
      <!-- Data display -->
      <div 
        v-if="data"
        class="group flex flex-row justify-center h-full w-full"
        :class="{ 'cursor-default': scrolled, 'cursor-pointer': !scrolled }"
        @click="onClick"
      >
        <!-- Letter + date -->
        <div 
          class="flex-shrink-0 flex-grow-0 basis-auto
            flex flex-col items-center
            w-96 transition-all"
          :class="{ 'group-hover:bg-gray-700/80': !scrolled }"
        >
          <div class="flex-initial p-4 text-6xl font-bold text-white text-center">
            {{ today ? 'Today' : dateString + '.' }}
          </div>
          <div class="flex-1 min-h-0 p-2">
            <RatingLetterIcon :rating="data.productionScore" class="max-h-full text-white"/>
          </div>
          <div class="flex-initial p-4 text-4xl font-bold text-white">
            {{ ratingDescription }}
          </div>
        </div>
        <!-- Illustration -->
        <div 
          class="h-full overflow-hidden transition-all"
          :class="{ 'opacity-0 flex-grow-[0.01] w-0': scrolled, 'flex-auto w-full': !scrolled }"
        >
          <img 
            :src="imgSrc"
            class="w-full h-full object-cover group-hover:scale-110 transition-all"
          />
        </div>
      </div>

      <!-- Skeleton loader -->
      <div 
        v-else
        class="group flex flex-row h-full w-full"
      >
        <!-- Letter + date -->
        <div 
          class="flex-shrink-0 flex-grow-0 basis-auto
            flex flex-col items-center
            w-96"
        >
          <div class="flex-initial w-52 h-16 bg-white/20 rounded-xl my-4 animate-pulse"></div>
          <div class="flex-1 min-h-0 p-2 bg-white/20 rounded-[50%] animate-pulse">
            <RatingLetterIcon :rating="1.0" class="max-h-full m-auto text-transparent"/>
          </div>
          <div class="flex-initial w-80 h-10 bg-white/20 rounded-xl my-4 animate-pulse"></div>
        </div>
        <!-- Illustration -->
        <div class="flex-auto h-full w-full overflow-hidden bg-white/20 animate-pulse">
        </div>
      </div>
    </Transition>
  </div>
</template>