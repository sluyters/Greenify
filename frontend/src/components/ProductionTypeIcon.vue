<script setup lang="ts">
import { computed } from 'vue';
import IconBiomass from './icons/electricity/IconBiomass.vue';
import IconCoal from './icons/electricity/IconCoal.vue';
import IconGeothermal from './icons/electricity/IconGeothermal.vue';
import IconHydro from './icons/electricity/IconHydro.vue';
import IconNaturalGas from './icons/electricity/IconNaturalGas.vue';
import IconNuclearPlant from './icons/electricity/IconNuclearPlant.vue';
import IconPetrol from './icons/electricity/IconPetrol.vue';
import IconSolar from './icons/electricity/IconSolar.vue';
import IconWind from './icons/electricity/IconWind.vue';

const props = defineProps<{
  type: string
}>();

const iconComponentName = computed(() => {
  switch(props.type) {
    case "biomass": return IconBiomass;
    case "coal": return IconCoal;
    case "geothermal": return IconGeothermal;
    case "hydro": return IconHydro;
    case "natural-gas": return IconNaturalGas;
    case "nuclear": return IconNuclearPlant;
    case "petrol": return IconPetrol;
    case "solar": return IconSolar;
    case "wind-offshore": return IconWind;
    case "wind-onshore": return IconWind;
    default: return undefined
  }
})

</script>

<template>
  <div v-bind="$attrs">
    <component :is="iconComponentName"></component>
  </div>
</template>