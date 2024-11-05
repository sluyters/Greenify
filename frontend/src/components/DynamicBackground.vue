<script setup lang="ts">

// Options
defineOptions({
  inheritAttrs: false
});

// Properties
interface Props {
  theme?: number;
  scrolled?: boolean
}
const { theme = -1, scrolled = false } = defineProps<Props>();
</script>

<template>
  <div class="fixed top-0 left-0 right-0 h-screen" v-bind="$attrs">
    <div class="absolute -z-50 top-0 bottom-0 left-0 right-0 transition-colors duration-300 ease-out" :class="{ 'bg-gradient-to-bl from-orange-800 to-pink-800': theme === 2, 'bg-gradient-to-bl from-slate-500 to-zinc-600': theme === 1, 'bg-gradient-to-bl from-green-300 to-teal-500': theme === 0 }"></div>
    <div class="absolute -z-40 top-0 bottom-0 left-0 right-0 transition-colors duration-300 ease-out" :class="{ 'bg-black': scrolled || theme === -1, 'bg-transparent': !scrolled && theme !== -1 }"></div>
  </div>
  
</template>