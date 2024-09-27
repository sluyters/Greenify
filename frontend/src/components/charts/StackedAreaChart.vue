<script setup lang="ts">
import * as d3 from 'd3';
import { useResizeObserver } from '@/composables/resize';
import { computed, useTemplateRef, watch } from 'vue';

type WideDataItem = {
  date: Date;
} & { [key: string]: number }

// Properties
interface Props {
  data?: { date: Date, data: { [key: string]: number }}[]; 
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  grid?: 'x' | 'y' | 'all' | 'none' | undefined | null;
}
const { 
  data = [
    { date: new Date('2024-09-10T00:00:00.000'), data: { 'Wind': 3, 'Nuclear': 40, 'Solar': 0 }},
    { date: new Date('2024-09-10T01:00:00.000'), data: { 'Wind': 5, 'Nuclear': 40, 'Solar': 0 }},
    { date: new Date('2024-09-10T02:00:00.000'), data: { 'Wind': 4, 'Nuclear': 39, 'Solar': 0 }},
    { date: new Date('2024-09-10T03:00:00.000'), data: { 'Wind': 4, 'Nuclear': 39, 'Solar': 0 }},
    { date: new Date('2024-09-10T04:00:00.000'), data: { 'Wind': 5, 'Nuclear': 40, 'Solar': 0 }},
    { date: new Date('2024-09-10T05:00:00.000'), data: { 'Wind': 6, 'Nuclear': 40, 'Solar': 0 }},
    { date: new Date('2024-09-10T06:00:00.000'), data: { 'Wind': 8, 'Nuclear': 40, 'Solar': 0 }},
    { date: new Date('2024-09-10T07:00:00.000'), data: { 'Wind': 10, 'Nuclear': 41, 'Solar': 3 }},
    { date: new Date('2024-09-10T08:00:00.000'), data: { 'Wind': 11, 'Nuclear': 41, 'Solar': 5 }},
    { date: new Date('2024-09-10T09:00:00.000'), data: { 'Wind': 13, 'Nuclear': 42, 'Solar': 12 }},
    { date: new Date('2024-09-10T10:00:00.000'), data: { 'Wind': 16, 'Nuclear': 41, 'Solar': 18 }},
    { date: new Date('2024-09-10T11:00:00.000'), data: { 'Wind': 18, 'Nuclear': 40, 'Solar': 24 }},
    { date: new Date('2024-09-10T12:00:00.000'), data: { 'Wind': 17, 'Nuclear': 39, 'Solar': 28 }},
    { date: new Date('2024-09-10T13:00:00.000'), data: { 'Wind': 16, 'Nuclear': 38, 'Solar': 29 }},
    { date: new Date('2024-09-10T14:00:00.000'), data: { 'Wind': 14, 'Nuclear': 39, 'Solar': 30 }},
    { date: new Date('2024-09-10T15:00:00.000'), data: { 'Wind': 12, 'Nuclear': 40, 'Solar': 29 }},
    { date: new Date('2024-09-10T16:00:00.000'), data: { 'Wind': 10, 'Nuclear': 41, 'Solar': 23 }},
    { date: new Date('2024-09-10T17:00:00.000'), data: { 'Wind': 10, 'Nuclear': 41, 'Solar': 17 }},
    { date: new Date('2024-09-10T18:00:00.000'), data: { 'Wind': 9, 'Nuclear': 42, 'Solar': 12 }},
    { date: new Date('2024-09-10T19:00:00.000'), data: { 'Wind': 8, 'Nuclear': 39, 'Solar': 7 }},
    { date: new Date('2024-09-10T20:00:00.000'), data: { 'Wind': 9, 'Nuclear': 38, 'Solar': 4 }},
    { date: new Date('2024-09-10T21:00:00.000'), data: { 'Wind': 9, 'Nuclear': 39, 'Solar': 2 }},
    { date: new Date('2024-09-10T22:00:00.000'), data: { 'Wind': 10, 'Nuclear': 40, 'Solar': 0 }},
    { date: new Date('2024-09-10T23:00:00.000'), data: { 'Wind': 12, 'Nuclear': 41, 'Solar': 0 }},
    { date: new Date('2024-09-11T00:00:00.000'), data: { 'Wind': 12, 'Nuclear': 40, 'Solar': 0 }},
  ], 
  marginTop = 10,
  marginBottom = 40,
  marginLeft = 40,
  marginRight = 40,
  grid = 'y',
} = defineProps<Props>();

// Template refs
const container = useTemplateRef('my-container');
const { width, height } = useResizeObserver(container); 
const gx = useTemplateRef('my-gx');
const gy = useTemplateRef('my-gy');

// Computed
const xScale = computed(() => {
  const [xMin, xMax] = d3.extent(data.map((item) => item.date));
  return d3
    .scaleTime()
    .domain([xMin || 0, xMax || 0])
    .nice(d3.timeDay)
    .range([marginLeft, width.value - marginRight]);
});
const yScale = computed(() => {
  const dataSum = data.map((item) => {
    return Object.entries(item.data)
      .reduce((prev, [, value]) => prev + value, 0);
  });
  const max = Math.max(...dataSum);
  return d3
    .scaleLinear()
    .domain([0, max])
    .range([height.value - marginBottom, marginTop]);
})

const parsedData = computed(() => {
  return data.map((item) => {
    const parsedItem: WideDataItem = Object.assign({ date: item.date }, item.data);
    return parsedItem;
  });
});

const xGrid = computed(() => {
  return xScale.value
    .ticks(d3.timeHour)
    .slice(1);
})
const yGrid = computed(() => {
  return yScale.value
    .ticks()
    .slice(1);
})

const series = computed(() => {
  const stackSeries = d3
    .stack()
    .keys(d3.union(data.flatMap(item => Object.keys(item.data))))
    .order(d3.stackOrderDescending)
    .offset(d3.stackOffsetNone);
  return stackSeries(parsedData.value)
});

const areaBuilder = computed(() => {
  return d3
    .area<any>()
    .x((d) => xScale.value(d.data.date))
    .y0((d) => yScale.value(d[0]))
    .y1((d) => yScale.value(d[1]))
    .curve(d3.curveCatmullRom.alpha(0.5));
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
watch([gy, yScale], ([newGy, newYScale]) => {
  if (newGy) {
    const yAxisGenerator = d3.axisLeft(newYScale);
    return d3
      .select(newGy)
      .call(yAxisGenerator);
  }
});

</script>

<template>
  <div ref="my-container" class="w-full h-full">
    <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`">
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
          :y1="yScale(value)"
          :y2="yScale(value)"
          stroke="#808080"
        />
      </g>
      <!-- Lines -->
      <g>
        <path 
          v-for="serie in series"
          :key="serie.index"
          :d="areaBuilder(serie) || undefined"
          opacity="1"
          stroke="none"
          class="fill-white hover:!opacity-90"
          :style="{ opacity: `${Math.round(90 * (1 - (serie.index + 1) / (series.length + 1)))}%` }"
        />
      </g>
      <!-- Axes -->
      <g ref="my-gx" class="text-sm" stroke-width="2.5" :transform="`translate(0, ${height - marginBottom})`" />
      <g ref="my-gy" class="text-sm" stroke-width="2.5" :transform="`translate(${marginLeft}, 0)`" />
    </svg>
  </div>
</template>