<script setup lang="ts">
import MainRating from '@/components/MainRating.vue';
import RatingsList from '@/components/RatingsList.vue';
import RatingsListItem from '@/components/RatingsListItem.vue';
import type { EnergyProductionDay } from '@/types/EnergyProductionDay.type';
import { onMounted, ref } from 'vue';

const DATA_TMP = [
  {
    id: 0,
    date: new Date('2024-09-12'),
    productionScore: 0.9,
    totalPower: 11000,
    productionDetails: [
      {
        name: 'wind-offshore',
        isForecast: false,
        power: 5000
      },
      {
        name: 'solar',
        isForecast: false,
        power: 4000
      },
      {
        name: 'nuclear',
        isForecast: false,
        power: 2000
      }
    ]
  },
  {
    id: 1,
    date: new Date('2024-09-13'),
    productionScore: 0.9,
    totalPower: 12000,
    productionDetails: [
      {
        name: 'biomass',
        isForecast: true,
        power: 6000
      },
      {
        name: 'coal',
        isForecast: true,
        power: 4000
      },
      {
        name: 'nuclear',
        isForecast: true,
        power: 2000
      }
    ]
  },
  {
    id: 2,
    date: new Date('2024-09-14'),
    productionScore: 0.8,
    totalPower: 12000,
    productionDetails: [
      {
        name: 'wind-onshore',
        isForecast: true,
        power: 9000
      },
      {
        name: 'petrol',
        isForecast: true,
        power: 2000
      },
      {
        name: 'natural-gas',
        isForecast: true,
        power: 1000
      }
    ]
  },
  {
    id: 3,
    date: new Date('2024-09-15'),
    productionScore: 0.6,
    totalPower: 15000,
    productionDetails: [
      {
        name: 'solar',
        isForecast: true,
        power: 12000
      },
      {
        name: 'hydro',
        isForecast: true,
        power: 2000
      },
      {
        name: 'geothermal',
        isForecast: true,
        power: 1000
      }
    ]
  },
  {
    id: 4,
    date: new Date('2024-09-16'),
    productionScore: 0.5,
    totalPower: 12000,
    productionDetails: [
      {
        name: 'nuclear',
        isForecast: true,
        power: 9000
      },
      {
        name: 'coal',
        isForecast: true,
        power: 2000
      },
      {
        name: 'wind-offshore',
        isForecast: true,
        power: 1000
      }
    ]
  },
  {
    id: 5,
    date: new Date('2024-09-17'),
    productionScore: 0.7,
    totalPower: 12000,
    productionDetails: [
      {
        name: 'natural-gas',
        isForecast: true,
        power: 9000
      },
      {
        name: 'solar',
        isForecast: true,
        power: 2000
      },
      {
        name: 'nuclear',
        isForecast: true,
        power: 1000
      }
    ]
  },
  {
    id: 6,
    date: new Date('2024-09-18'),
    productionScore: 0.2,
    totalPower: 14000,
    productionDetails: [
      {
        name: 'geothermal',
        isForecast: true,
        power: 9000
      },
      {
        name: 'hydro',
        isForecast: true,
        power: 4000
      },
      {
        name: 'nuclear',
        isForecast: true,
        power: 1000
      }
    ]
  },
  {
    id: 7,
    date: new Date('2024-09-19'),
    productionScore: 0.3,
    totalPower: 12000,
    productionDetails: [
      {
        name: 'wind-offshore',
        isForecast: true,
        power: 8000
      },
      {
        name: 'solar',
        isForecast: true,
        power: 2000
      },
      {
        name: 'nuclear',
        isForecast: true,
        power: 2000
      }
    ]
  }
];

// const data = undefined;
const data = ref<EnergyProductionDay[]|undefined>();

onMounted(async () => {
  await new Promise(resolve => setTimeout(() => { 
    data.value = DATA_TMP;
    resolve; 
  }, 2000));
});

</script>

<template>
  <div class="flex flex-col gap-8">
    <MainRating :data="data ? data[0] : undefined"/>
    <RatingsList v-if="data">
      <RatingsListItem v-for="item in data.slice(1)" :key="item.id" :data="item"/>
    </RatingsList>
    <RatingsList v-else>
      <RatingsListItem v-for="index in 7" :key="index"/>
    </RatingsList>
  </div>
</template>