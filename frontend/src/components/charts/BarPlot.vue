<script setup lang="ts">
import { useResizeObserver } from '@/composables/resize';
import * as d3 from 'd3';
import { computed, useTemplateRef, watch } from 'vue';


// Properties
interface Props {
  data?: { [key: string]: number };
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  padding?: number;
  grid?: 'x' | 'all' | 'none' | undefined | null;
}
const { 
  data = { 'Wind': 160, 'Nuclear': 410, 'Solar': 180 }, 
  marginTop = 10,
  marginBottom = 40,
  marginLeft = 40,
  marginRight = 40,
  padding = 0.1,
  grid = 'all'
} = defineProps<Props>();

// Template refs
const container = useTemplateRef('my-container')
const { width, height } = useResizeObserver(container);
const gx = useTemplateRef('my-gx');
const gy = useTemplateRef('my-gy');

// Computed
const sortedData = computed(() => {
  return Object.entries(data).sort(([keyA, valueA], [keyB, valueB]) => valueA - valueB);
});
const xScale = computed(() => {
  return d3
    .scaleLinear()
    .domain([0, Math.max(...sortedData.value.map(([key, value]) => value))])
    .range([marginLeft, width.value - marginRight]);
});
const yScale = computed(() => {
  return d3
    .scaleBand()
    .domain(sortedData.value.map(([key, value]) => key))
    .range([height.value - marginBottom, marginTop])
    .padding(padding);
});
const xGrid = computed(() => {
  return xScale.value
    .ticks()
    .slice(1);
})
// const x = computed(() => d3.scaleTime([new Date(), new Date()], [margin, width.value - margin]).nice());

// Watchers
watch([gx, xScale], ([newGx, newXScale]) => {
  if (newGx) {
    return d3
      .select(newGx)
      .call(d3.axisBottom(newXScale));
  }
});
watch([gy, yScale], ([newGy, newYScale]) => {
  if (newGy) {
    return d3
      .select(newGy)
      .call(d3.axisLeft(newYScale).tickValues([]))
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
      <!-- Bars -->
      <g v-for="([key, value], index) in sortedData" :key="`bar-${index}`">
        <rect 
          :x="xScale(0)"
          :y="yScale(key)"  
          :width="xScale(value) - marginLeft"
          :height="yScale.bandwidth()"
          class="fill-white/65 hover:fill-white/90"
        />
        <text
          class="text-base font-bold"
          :class="{ 'fill-gray-200': xScale(value) <= 100, 'fill-gray-700': xScale(value) > 100 }"
          :x="xScale(0) + 10"
          :y="(yScale(key) || 0) + yScale.bandwidth() / 2"
          text-anchor="start"
          alignment-baseline="central"
        >
          {{ key }} {{ xScale(value) <= 100 ? `(${value})` : '' }}
        </text>
        <text
          v-if="xScale(value) > 100"
          class="text-base font-bold fill-gray-600"
          :x="xScale(value) - 10"
          :y="(yScale(key) || 0) + yScale.bandwidth() / 2"
          text-anchor="end"
          alignment-baseline="central"
        >
          {{ (Math.round(value * 10) / 10).toFixed(1) }}
        </text>
      </g>
      <!-- Axes -->
      <g ref="my-gx" class="text-sm" stroke-width="2.5" :transform="`translate(0, ${height - marginBottom})`" />
      <g ref="my-gy" stroke-width="2.5" :transform="`translate(${marginLeft}, 0)`"  />
    </svg>
  </div>
</template>