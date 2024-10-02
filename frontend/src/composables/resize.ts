import { onBeforeUnmount, onMounted, ref, type ShallowRef } from "vue";

export function useResizeObserver(elem: Readonly<ShallowRef<HTMLDivElement | null>>) {
  const width = ref(0);
  const height = ref(0);

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.contentBoxSize && entry.contentBoxSize[0]) {
        width.value = entry.contentBoxSize[0].inlineSize;
        height.value = entry.contentBoxSize[0].blockSize;
      }
    }
  });

  onMounted(() => resizeObserver.observe(elem.value, { box: 'content-box' }));
  onBeforeUnmount(() => resizeObserver.unobserve(elem.value));

  return { width, height }
}