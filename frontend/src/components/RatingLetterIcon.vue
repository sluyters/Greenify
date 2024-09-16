<script setup lang="ts">
import { computed } from 'vue';
import IconLetterA from './icons/letters/IconLetterA.vue';
import IconLetterB from './icons/letters/IconLetterB.vue';
import IconLetterC from './icons/letters/IconLetterC.vue';
import IconLetterD from './icons/letters/IconLetterD.vue';
import IconLetterE from './icons/letters/IconLetterE.vue';
import IconLetterF from './icons/letters/IconLetterF.vue';
import IconLetterG from './icons/letters/IconLetterG.vue';

const props = defineProps<{
  rating: number
}>();

const iconComponentName = computed(() => {
  if (props.rating < 1 / 7) {
    return IconLetterG;
  } else if (props.rating < 2 / 7) {
    return IconLetterF;
  } else if (props.rating < 3 / 7) {
    return IconLetterE;
  } else if (props.rating < 4 / 7) {
    return IconLetterD;
  } else if (props.rating < 5 / 7) {
    return IconLetterC;
  } else if (props.rating < 6 / 7) {
    return IconLetterB;
  } else {
    return IconLetterA;
  }
})

</script>

<template>
  <div v-bind="$attrs">
    <component :is="iconComponentName"></component>
  </div>
</template>