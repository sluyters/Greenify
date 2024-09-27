<script setup lang="ts">
import * as d3 from 'd3';
import { useResizeObserver } from '@/composables/resize';
import { computed, useTemplateRef, watch } from 'vue';
import IconLetterA from '../icons/letters/IconLetterA.vue';
import RatingLetterIcon from '../RatingLetterIcon.vue';
import { getEnergyTheme } from '@/functions/energy-theme';

// Properties
interface DataItem { 
  timestamp: Date; 
  price: number; 
  rating: number; 
}
interface Props {
  data?: DataItem[];
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  grid?: 'x' | 'y' | 'all' | 'none' | undefined | null;
}
const { 
  data = [
    { timestamp: new Date('2024-09-10T00:00:00.000'), price: 0.3, rating: 0.5 },
    { timestamp: new Date('2024-09-10T01:00:00.000'), price: 0.35, rating: 0.52 },
    { timestamp: new Date('2024-09-10T02:00:00.000'), price: 0.34, rating: 0.53 },
    { timestamp: new Date('2024-09-10T03:00:00.000'), price: 0.34, rating: 0.55 },
    { timestamp: new Date('2024-09-10T04:00:00.000'), price: 0.35, rating: 0.56 },
    { timestamp: new Date('2024-09-10T05:00:00.000'), price: 0.36, rating: 0.56 },
    { timestamp: new Date('2024-09-10T06:00:00.000'), price: 0.38, rating: 0.6 },
    { timestamp: new Date('2024-09-10T07:00:00.000'), price: 0.40, rating: 0.65 },
    { timestamp: new Date('2024-09-10T08:00:00.000'), price: 0.41, rating: 0.67 },
    { timestamp: new Date('2024-09-10T09:00:00.000'), price: 0.39, rating: 0.70 },
    { timestamp: new Date('2024-09-10T10:00:00.000'), price: 0.38, rating: 0.75 },
    { timestamp: new Date('2024-09-10T11:00:00.000'), price: 0.36, rating: 0.8 },
    { timestamp: new Date('2024-09-10T12:00:00.000'), price: 0.37, rating: 0.82 },
    { timestamp: new Date('2024-09-10T13:00:00.000'), price: 0.36, rating: 0.84 },
    { timestamp: new Date('2024-09-10T14:00:00.000'), price: 0.34, rating: 0.85 },
    { timestamp: new Date('2024-09-10T15:00:00.000'), price: 0.32, rating: 0.84 },
    { timestamp: new Date('2024-09-10T16:00:00.000'), price: 0.30, rating: 0.83 },
    { timestamp: new Date('2024-09-10T17:00:00.000'), price: 0.29, rating: 0.8 },
    { timestamp: new Date('2024-09-10T18:00:00.000'), price: 0.30, rating: 0.71 },
    { timestamp: new Date('2024-09-10T19:00:00.000'), price: 0.28, rating: 0.60 },
    { timestamp: new Date('2024-09-10T20:00:00.000'), price: 0.29, rating: 0.51 },
    { timestamp: new Date('2024-09-10T21:00:00.000'), price: 0.29, rating: 0.40 },
    { timestamp: new Date('2024-09-10T22:00:00.000'), price: 0.30, rating: 0.32 },
    { timestamp: new Date('2024-09-10T23:00:00.000'), price: 0.32, rating: 0.25 },
    { timestamp: new Date('2024-09-11T00:00:00.000'), price: 0.32, rating: 0.20 },
  ], 
  marginTop = 10,
  marginBottom = 40,
  marginLeft = 40,
  marginRight = 40,
  grid = 'y',
} = defineProps<Props>();
// const { data = [-1, 2, 3, 4, 7, 5], margin = 30 } = defineProps<Props>();

// Template refs
const container = useTemplateRef('my-container')
const { width, height } = useResizeObserver(container);
const gx = useTemplateRef('my-gx');
const gy1 = useTemplateRef('my-gy1');
const gy2 = useTemplateRef('my-gy2');

// Computed
const xScale = computed(() => { 
  const [xMin, xMax] = d3.extent(data.map((item) => item.timestamp));
  console.log(xMin, xMax)
  return d3
    .scaleTime()
    .domain([xMin || 0, xMax || 0]) // TODO
    .nice(d3.timeDay)
    .range([marginLeft, width.value - marginRight]);
});
const yScales = computed(() => {
  const [priceMin, priceMax] = d3.extent(data.map((item) => item.price));
  let priceScale = d3
    .scaleLinear()
    .domain([priceMin || 0, priceMax || 0])
    .range([height.value - marginBottom, marginTop]);
  let rankingScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([height.value - marginBottom, marginTop])
  return {
    price: priceScale,
    rating: rankingScale
  };
});
const lines = computed(() => {
  let priceLine = d3
  .line<DataItem>()
    .x(d => xScale.value(d.timestamp))
    .y(d => yScales.value.price(d.price))
    .curve(d3.curveCatmullRom.alpha(0.5));
  let rankingLine = d3
    .line<DataItem>()
    .x(d => xScale.value(d.timestamp))
    .y(d => yScales.value.rating(d.rating))
    .curve(d3.curveCatmullRom.alpha(0.5));
  return {
    price: priceLine,
    rating: rankingLine
  };
});
const xGrid = computed(() => {
  return xScale.value
    .ticks(d3.timeHour)
    .slice(1);
})
const yGrid = computed(() => {
  return yScales.value.rating
    .ticks()
    .slice(1);
})

// Watchers
watch([gx, xScale], ([newGx, newXSCale]) => {
  if (newGx) {
    const xAxisGenerator = d3
      .axisBottom<Date>(newXSCale)
      .ticks(d3.timeHour)
      .tickFormat(d3.timeFormat('%H:%M'));
    return d3
      .select(newGx)
      .call(xAxisGenerator);
  }
});
watch([gy1, yScales], ([newGy1, newYScales]) => {
  if (newGy1) {
    const yAxisGenerator = d3.axisLeft(newYScales.rating);
    return d3
      .select(newGy1)
      .call(yAxisGenerator);
  }
});
watch([gy2, yScales], ([newGy2, newYScales]) => {
  if (newGy2) {
    const yAxisGenerator = d3.axisRight(newYScales.price);
    return d3
      .select(newGy2)
      .call(yAxisGenerator);
  }
});

</script>

<template>
  <div class="flex flex-col w-full h-full">
    <!-- Rating letters -->
    <div class="flex-none w-full h-5">
      <svg xmlns="http://www.w3.org/2000/svg" :width="width" height="100%" :viewBox="`0 0 ${width} 20`">
        <g :transform="`translate(-${width / 2}, 0)`">
          <RatingLetterIcon
            v-for="(item, index) in data.slice(1, -1)" :key="index" 
            :rating="item.rating" 
            :x="xScale(item.timestamp)"
            :y="0"
            :class="{ 'text-orange-800': getEnergyTheme(item.rating) === 2, 'text-slate-500': getEnergyTheme(item.rating) === 1, 'text-teal-500': getEnergyTheme(item.rating) === 0 }"
          />
        </g>
      </svg>

    </div>
    <!-- SVG Graph -->
    <div ref="my-container" class="flex-auto w-full h-full">
      <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`">
        <defs>
          <linearGradient 
            id="gradient"
            gradientUnits="userSpaceOnUse"
            x1="0"
            x2="0"
            :y1="height - marginBottom"
            :y2="marginTop"
          >
            <!-- TODO use non-hardcoded (tailwind) color values -->
            <stop offset="5%" stop-color="#9a3412"/>
            <stop :offset="`${Math.round(100* 4 / 7)}%`" stop-color="#64748b" />
            <stop offset="95%" stop-color="#14b8a6" />
          </linearGradient>
        </defs>
        <!-- Background -->
        <g>
          <rect 
            :x="marginLeft" 
            :y="marginTop" 
            :width="width - (marginLeft + marginRight)"
            :height="height - (marginTop + marginBottom)"
            class="fill-black/30"
          />
        </g>
        <!-- Grid -->
        <g v-if="grid && ['x', 'all'].includes(grid)">
          <line 
            v-for="(value, index) in xGrid" :key="`grid-x-${index}`"
            stroke-dasharray="5,5"
            :x1="xScale(value)"
            :x2="xScale(value)"
            :y1="marginTop"
            :y2="height - marginBottom"
            stroke="#808080"
          />
        </g>
        <g v-if="grid && ['y', 'all'].includes(grid)">
          <line 
            v-for="(value, index) in yGrid" :key="`grid-y-${index}`"
            stroke-dasharray="5,5"
            :x1="marginLeft"
            :x2="width - marginRight"
            :y1="yScales.rating(value)"
            :y2="yScales.rating(value)"
            stroke="#808080"
          />
        </g>
        <!-- Line -->
        <path fill="none" stroke="url(#gradient)" stroke-width="5.5" :d="lines.rating(data) || undefined" />
        <path fill="none" stroke="currentColor" stroke-width="5.5" :d="lines.price(data) || undefined" />
        <!-- Axes -->
        <g ref="my-gx" class="text-sm" stroke-width="2.5" :transform="`translate(0, ${height - marginBottom})`" />
        <g ref="my-gy1" class="text-sm" stroke-width="2.5" :transform="`translate(${marginLeft}, 0)`" />
        <g ref="my-gy2" class="text-sm" stroke-width="2.5" :transform="`translate(${width - marginRight}, 0)`" />
        <!-- Ratings icons TODO -->
        
      </svg>
    </div>
  </div>
</template>