<script setup lang="ts">
import MainRating from '@/components/MainRating.vue';
import RatingsList from '@/components/RatingsList.vue';
import RatingsListItem from '@/components/RatingsListItem.vue';
import type { EnergyProductionDay } from '@/types/EnergyProductionDay.type';
import { computed, onMounted, ref } from 'vue';

const DATA_TMP = [
  {
    id: 0,
    date: new Date('2024-09-12'),
    productionScore: 0.9,
    totalPower: 15000,
    productionDetails: [
      {
        name: 'wind-offshore',
        isForecast: false,
        power: 3000
      },
      {
        name: 'solar',
        isForecast: false,
        power: 1000
      },
      {
        name: 'nuclear',
        isForecast: false,
        power: 2000
      },
      {
        name: 'biomass',
        isForecast: true,
        power: 0
      },
      {
        name: 'coal',
        isForecast: true,
        power: 1000
      },
      {
        name: 'wind-onshore',
        isForecast: true,
        power: 2500
      },
      {
        name: 'petrol',
        isForecast: true,
        power: 0
      },
      {
        name: 'natural-gas',
        isForecast: true,
        power: 1500
      },
      {
        name: 'hydro',
        isForecast: true,
        power: 1700
      },
      {
        name: 'geothermal',
        isForecast: true,
        power: 1300
      }
    ]
  },
  {
    id: 0,
    date: new Date('2024-09-12'),
    productionScore: 0.0,
    totalPower: 15000,
    productionDetails: [
      {
        name: 'wind-offshore',
        isForecast: false,
        power: 3000
      },
      {
        name: 'solar',
        isForecast: false,
        power: 1000
      },
      {
        name: 'nuclear',
        isForecast: false,
        power: 2000
      },
      {
        name: 'biomass',
        isForecast: true,
        power: 0
      },
      {
        name: 'coal',
        isForecast: true,
        power: 1000
      },
      {
        name: 'wind-onshore',
        isForecast: true,
        power: 2500
      },
      {
        name: 'petrol',
        isForecast: true,
        power: 0
      },
      {
        name: 'natural-gas',
        isForecast: true,
        power: 1500
      },
      {
        name: 'hydro',
        isForecast: true,
        power: 1700
      },
      {
        name: 'geothermal',
        isForecast: true,
        power: 1300
      }
    ]
  },
  {
    id: 0,
    date: new Date('2024-09-12'),
    productionScore: 0.7,
    totalPower: 15000,
    productionDetails: [
      {
        name: 'wind-offshore',
        isForecast: false,
        power: 3000
      },
      {
        name: 'solar',
        isForecast: false,
        power: 1000
      },
      {
        name: 'nuclear',
        isForecast: false,
        power: 2000
      },
      {
        name: 'biomass',
        isForecast: true,
        power: 0
      },
      {
        name: 'coal',
        isForecast: true,
        power: 1000
      },
      {
        name: 'wind-onshore',
        isForecast: true,
        power: 2500
      },
      {
        name: 'petrol',
        isForecast: true,
        power: 0
      },
      {
        name: 'natural-gas',
        isForecast: true,
        power: 1500
      },
      {
        name: 'hydro',
        isForecast: true,
        power: 1700
      },
      {
        name: 'geothermal',
        isForecast: true,
        power: 1300
      }
    ]
  },
  {
    id: 0,
    date: new Date('2024-09-12'),
    productionScore: 0.2,
    totalPower: 15000,
    productionDetails: [
      {
        name: 'wind-offshore',
        isForecast: false,
        power: 3000
      },
      {
        name: 'solar',
        isForecast: false,
        power: 1000
      },
      {
        name: 'nuclear',
        isForecast: false,
        power: 2000
      },
      {
        name: 'biomass',
        isForecast: true,
        power: 0
      },
      {
        name: 'coal',
        isForecast: true,
        power: 1000
      },
      {
        name: 'wind-onshore',
        isForecast: true,
        power: 2500
      },
      {
        name: 'petrol',
        isForecast: true,
        power: 0
      },
      {
        name: 'natural-gas',
        isForecast: true,
        power: 1500
      },
      {
        name: 'hydro',
        isForecast: true,
        power: 1700
      },
      {
        name: 'geothermal',
        isForecast: true,
        power: 1300
      }
    ]
  },
  {
    id: 0,
    date: new Date('2024-09-12'),
    productionScore: 0.65,
    totalPower: 15000,
    productionDetails: [
      {
        name: 'wind-offshore',
        isForecast: false,
        power: 3000
      },
      {
        name: 'solar',
        isForecast: false,
        power: 1000
      },
      {
        name: 'nuclear',
        isForecast: false,
        power: 2000
      },
      {
        name: 'biomass',
        isForecast: true,
        power: 0
      },
      {
        name: 'coal',
        isForecast: true,
        power: 1000
      },
      {
        name: 'wind-onshore',
        isForecast: true,
        power: 2500
      },
      {
        name: 'petrol',
        isForecast: true,
        power: 0
      },
      {
        name: 'natural-gas',
        isForecast: true,
        power: 1500
      },
      {
        name: 'hydro',
        isForecast: true,
        power: 1700
      },
      {
        name: 'geothermal',
        isForecast: true,
        power: 1300
      }
    ]
  },
  {
    id: 0,
    date: new Date('2024-09-12'),
    productionScore: 0.6,
    totalPower: 15000,
    productionDetails: [
      {
        name: 'wind-offshore',
        isForecast: false,
        power: 3000
      },
      {
        name: 'solar',
        isForecast: false,
        power: 1000
      },
      {
        name: 'nuclear',
        isForecast: false,
        power: 2000
      },
      {
        name: 'biomass',
        isForecast: true,
        power: 0
      },
      {
        name: 'coal',
        isForecast: true,
        power: 1000
      },
      {
        name: 'wind-onshore',
        isForecast: true,
        power: 2500
      },
      {
        name: 'petrol',
        isForecast: true,
        power: 0
      },
      {
        name: 'natural-gas',
        isForecast: true,
        power: 1500
      },
      {
        name: 'hydro',
        isForecast: true,
        power: 1700
      },
      {
        name: 'geothermal',
        isForecast: true,
        power: 1300
      }
    ]
  },
  {
    id: 0,
    date: new Date('2024-09-12'),
    productionScore: 0.5,
    totalPower: 15000,
    productionDetails: [
      {
        name: 'wind-offshore',
        isForecast: false,
        power: 3000
      },
      {
        name: 'solar',
        isForecast: false,
        power: 1000
      },
      {
        name: 'nuclear',
        isForecast: false,
        power: 2000
      },
      {
        name: 'biomass',
        isForecast: true,
        power: 0
      },
      {
        name: 'coal',
        isForecast: true,
        power: 1000
      },
      {
        name: 'wind-onshore',
        isForecast: true,
        power: 2500
      },
      {
        name: 'petrol',
        isForecast: true,
        power: 0
      },
      {
        name: 'natural-gas',
        isForecast: true,
        power: 1500
      },
      {
        name: 'hydro',
        isForecast: true,
        power: 1700
      },
      {
        name: 'geothermal',
        isForecast: true,
        power: 1300
      }
    ]
  },
];

// Options
defineOptions({
  inheritAttrs: false
})

// State
// const data = undefined;
const data = ref<EnergyProductionDay[]|undefined>();
const scrollPosition = ref(0);

// Computed properties
const scrolled = computed(() => scrollPosition.value > 200 ? true : false);

// Functions
function updateScroll() {
  scrollPosition.value = window.scrollY;
}

// Hooks
onMounted(async () => {
  window.addEventListener('scroll', updateScroll);
  await new Promise(resolve => setTimeout(() => { 
    data.value = DATA_TMP;
    resolve; 
  }, 2000));
});

</script>

<template>
    <div v-bind="$attrs">
      <div class="bg-gradient-to-bl from-green-300 to-teal-500 fixed -z-50 top-0 bottom-0 left-0 right-0"></div>
      <div class="bg-transparent fixed -z-40 top-0 bottom-0 left-0 right-0 transition-colors duration-500" :class="{ 'bg-black': scrolled }"></div>
      <div class="container mx-auto py-8 flex flex-col gap-8 z-0">
        <MainRating :data="data ? data[0] : undefined" :scrolled="scrolled"/>
        <RatingsList :data="data"/>
      </div>
    </div>
</template>