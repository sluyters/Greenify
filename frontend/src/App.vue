<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue';
</script>

<template>
  <body class="relative h-full w-full">
    <NavBar class="z-50">
      <RouterLink to="/" class="p-2 sm:px-2 sm:py-1" exact-active-class="p-2 rounded-md bg-white/10 sm:px-2 sm:py-1">Forecast</RouterLink>
      <RouterLink to="/archive" class="p-2 sm:px-2 sm:py-1" exact-active-class="p-2 rounded-md bg-white/10 sm:px-2 sm:py-1">Archive</RouterLink>
      <RouterLink to="/help" class="p-2 sm:px-2 sm:py-1" exact-active-class="p-2 rounded-md bg-white/10 sm:px-2 sm:py-1">Help</RouterLink>
    </NavBar>
    <RouterView class="pt-16 min-h-screen w-full"/>
  </body>
</template>
