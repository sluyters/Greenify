<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import RatingLetterIcon from './RatingLetterIcon.vue';
import ProductionTypeIcon from './ProductionTypeIcon.vue';
import type { EnergyProductionDay } from '@/types/EnergyProductionDay.type';

// Properties
interface Props {
  scrolled?: boolean;
  data?: EnergyProductionDay;
}
const { data = undefined, scrolled = false } = defineProps<Props>();

// Router
const router = useRouter();

// Computed properties
const dayString = computed(() => {
  if (data) {
    return data.date.toLocaleDateString(undefined, { weekday: 'long' })
  } else {
    return undefined;
  }
})
const dateString = computed(() => {
  if (data) {
    return data.date.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })
  } else {
    return undefined;
  }
});

// Functions
function onClick() {
  if (data) {
    router.push({ path: '/details', query: { id: data.id } });
  }
}
</script>

<template>
  <div 
    class="group h-[28rem] w-full rounded-2xl overflow-hidden bg-gray-700/70 transition-colors" 
    :class="{ 'bg-transparent duration-500': scrolled && data }"
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
        class="group flex flex-row justify-center h-full w-full cursor-pointer"
        :class="{ 'cursor-default': scrolled }"
      >
        <!-- Letter + date -->
        <div 
          class="flex-shrink-0 flex-grow-0 basis-auto
            flex flex-col items-center
            w-96 transition-all"
          :class="{ 'group-hover:bg-gray-700/80': !scrolled }"
        >
          <div class="flex-initial p-4 text-6xl font-bold text-white">
            Today
          </div>
          <div class="flex-1 min-h-0 p-2">
            <RatingLetterIcon :rating=".9" class="max-h-full text-white"/>
          </div>
          <div class="flex-initial p-4 text-4xl font-bold text-white">
            Very good <!-- TODO -->
          </div>
        </div>
        <!-- Illustration -->
        <div 
          class="flex-auto h-full w-full overflow-hidden transition-all"
          :class="{ 'opacity-0 flex-grow-[0.01] w-0': scrolled }"
        >
          <img 
            src="/background/energy-good.jpg"
            class="w-full h-full group-hover:scale-110 transition-all"
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