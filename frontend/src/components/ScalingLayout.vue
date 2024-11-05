<script setup lang="ts">
import { useScrollPosition } from '@/composables/scroll';
import { computed, watchEffect } from 'vue';


interface Props {
  scrollOffset?: number;
  headerExpandedHeight?: number;
  headerCollapsedHeight?: number;
  headerCollapseRatio?: number;
}
const { scrollOffset = 0, headerExpandedHeight = 256, headerCollapsedHeight = 64, headerCollapseRatio = .5 } = defineProps<Props>();

const emit = defineEmits(['collapse']);

const scrollPosition = useScrollPosition();
const headerHeight = computed(() => {
  return Math.max(headerExpandedHeight - scrollPosition.value, headerCollapsedHeight);
});
const headerCollapsed = computed(() => {
  const collapseThreshold = headerCollapseRatio * (headerExpandedHeight + headerCollapsedHeight);
  return headerHeight.value < collapseThreshold;
})

// Send event when header is collapsed
watchEffect(() => {
  emit('collapse', headerCollapsed.value);
})

</script>

<template>
  <div>
    <!-- Scaling header -->
    <div
      v-if="$slots.header"
      class="sticky w-full flex items-center z-10"
      :style="{ height: `${headerExpandedHeight}px`, top: `${-(headerExpandedHeight - headerCollapsedHeight - scrollOffset)}px` }"
    >
      <div
        class="sticky w-full overflow-hidden"
        :style="{ height: `${headerHeight}px`, top: `${scrollOffset}px` }"
      >
        <slot name="header"></slot>
      </div>
    </div>
    <!-- Main content in default slot -->
    <div class="relativ w-full z-0">
      <slot></slot>
    </div>
  </div>
</template>