<script setup lang="ts">
import { transition } from 'd3';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import MenuIcon from '~icons/ic/round-menu';

const showMenu = ref(false);

// Router
const router = useRouter();

// Functions
function onClick() {
  router.push('/')
}

function handleHamburgerClick() {
  showMenu.value = !showMenu.value;
}
</script>

<template>
  <!-- Use pseudo-element for backdrop blur to avoid breaking fixed positionning of child element -->
  <div class="fixed flex flex-wrap gap-4 justify-start top-0 left-0 w-full h-16 border-gray-700 border-b text-white px-4 box-border
  after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-gray-700/80 after:backdrop-blur-lg after:-z-10">
    <button 
      @click="handleHamburgerClick" 
      value="hamburger"
      class="flex-none sm:hidden"
    >
      <MenuIcon />
    </button>
    <a class="flex-none text-2xl font-bold content-center cursor-pointer" @click="onClick"> Greenify </a>
    <nav 
      class="fixed left-0 top-16 bottom-0 w-72 max-w-full p-2 z-10
        font-bold
        bg-gray-700/80
        backdrop-blur-lg
        flex flex-col gap-1
        sm:static sm:flex-row sm:text-md sm:bg-transparent sm:text-white sm:flex-1 sm:justify-end sm:items-center transition-transform"
      :class="{ 'max-sm:-translate-x-72': !showMenu }"
        >
      <slot/>
    </nav>
    <!-- TODO remove element from DOM when menu hidden -->
    <Transition 
      enter-from-class="opacity-0"
      enter-active-class="transition-opacity"
      leave-active-class="transition-opacity"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showMenu"
        class="fixed left-0 top-16 bottom-0 right-0 bg-black/30 backdrop-blur-md sm:hidden transition-opacity"
      >
    </div>
    </Transition>
    
  </div>
</template>

<style>

</style>