import { computed, onMounted, onUnmounted, ref } from "vue"

export function useScrollPosition() {
  const scrollPosition = ref(0);
  
  function updateScroll() {
    scrollPosition.value = window.scrollY;
  }

  onMounted(() => window.addEventListener('scroll', updateScroll));
  onUnmounted(() => window.removeEventListener('scroll', updateScroll));

  return scrollPosition;
}

export function useScrollDetection(threshold: number = 200) {
  const scrollPosition = ref(0);

  const scrolled = computed(() => scrollPosition.value > threshold ? true : false);

  function updateScroll() {
    scrollPosition.value = window.scrollY;
  }

  onMounted(() => window.addEventListener('scroll', updateScroll));
  onUnmounted(() => window.removeEventListener('scroll', updateScroll));

  return scrolled;
}