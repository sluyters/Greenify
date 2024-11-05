<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import RatingLetterIcon from './RatingLetterIcon.vue';
import type { EnergyProductionDay } from '@/types/EnergyProductionDay.type';
import { useScrollPosition } from '@/composables/scroll';

// Emits
const emit = defineEmits(['click-item']);

// Properties
interface Props {
  today?: boolean;
  collapsed?: boolean;
  theme?: number;
  data?: EnergyProductionDay | null;
}
const { today = false, collapsed = false, theme = -1, data = null } = defineProps<Props>();

// Router
const router = useRouter();

// Computed properties
const ratingDescription = computed(() => {
  if (!data) {
    return '';
  } else if (data.score < 1 / 7) {
    return 'Terrible';
  } else if (data.score < 2 / 7) {
    return 'Poor';
  } else if (data.score < 3 / 7) {
    return 'Mediocre';
  } else if (data.score < 4 / 7) {
    return 'Average';
  } else if (data.score < 5 / 7) {
    return 'Good';
  } else if (data.score < 6 / 7) {
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
const date = computed(() => {
  return data ? new Date(data.date) : undefined;
});
const dateString = computed(() => {
  return date.value ? date.value.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
});
const numDateString = computed(() => {
    return date.value ? date.value.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' }) : '';
});

// Functions
function onClick() {
  if (data) {
    emit('click-item', data.date);
    // router.push({ path: '/details', query: { id: data.id } });
  }
}
</script>

<template>
  <div 
    class="relative w-full h-full p-2 transition-colors duration-300 ease-out sm:p-4"
    :class="{ 'bg-black/80 backdrop-blur-lg': collapsed, 'bg-transparent': !collapsed }"
  >
    <Transition
      enter-active-class="transition-opacity duration-150"
      leave-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
      mode="out-in"
    >
      <!-- Data -->
      <div
        v-if="data"
        class="group relative w-full h-full cursor-pointer overflow-hidden rounded-2xl sm:container sm:mx-auto"
        :class="{ 'border border-transparent hover:border-gray-700': !collapsed }"
        @click="onClick()"
      >
        <!-- Illustration -->
        <div 
          class="absolute top-0 left-0 h-full w-full transition-opacity duration-300 ease-out"
          :class="{ 'opacity-0': collapsed, 'opacity-100': !collapsed }"
        >
          <img 
            :src="imgSrc"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-150"
          />
        </div>
        <!-- Score and date -->
        <div 
          class="flex h-full p-2"
          :class="{ 'flex-row justify-center items-center w-full gap-2': collapsed, 'flex-col justify-start items-start gap-2': !collapsed }"
        >
          <!-- Date -->
          <div 
            class="flex-initial flex text-3xl font-bold"
            :class="{ 'flex-col items-end': collapsed, 'flex-row gap-2 bg-gray-700/60 backdrop-blur-md rounded-lg px-3 py-1': !collapsed }"
          >
            <div class="text-white text-right">
              {{ today ? 'Today' : dateString }}
            </div>
            <div v-if="today" class="text-white/80">
              {{ numDateString }}
            </div>
          </div>
          <!-- Score letter -->
          <div 
            class="flex-none min-h-0 pb-3 pt-2 pl-2 pr-3"
            :class="{ 'bg-gray-700/60 backdrop-blur-md rounded-lg': !collapsed }"
          >
              <RatingLetterIcon :rating="data.score" class="max-h-16 text-white"/>
          </div>
          <!-- Score description -->
          <div 
            class="flex-initial text-3xl font-bold text-white"
            :class="{ 'bg-gray-700/60 backdrop-blur-md rounded-lg px-3 py-1': !collapsed }"
          >
            {{ ratingDescription }}
          </div>
        </div>
      </div>
      
      <!-- Skeleton loader -->
      <div
        v-else
        class="relative w-full h-full cursor-pointer overflow-hidden rounded-2xl  sm:container sm:mx-auto flex p-2"
        :class="{ 'flex-row justify-center items-center w-full gap-2': collapsed, 'flex-col justify-start items-start gap-2 bg-gray-700/70': !collapsed }"
      >

        <div class="flex-initial w-44 h-11 bg-white/20 rounded-lg animate-pulse"></div>
        <div 
          class="flex-none min-h-0 pb-3 pt-2 pl-2 pr-3 bg-white/20 rounded-lg animate-pulse"
          :class="{ 'rounded-full': collapsed }"
        >
          <RatingLetterIcon :rating="1.0" class="max-h-16 text-transparent" :class="{ 'max-h-12': collapsed }"/>
        </div>
        <div class="flex-initial w-36 h-11 bg-white/20 rounded-lg animate-pulse"></div>
      </div>
    </Transition>
  </div>
</template>